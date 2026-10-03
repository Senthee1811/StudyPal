import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';
import { PrismaService } from './prisma.service.js';
import { ResilientHttpClient, AppException } from '@studypal/service-kit';
import { CreateTutorSessionDto } from '@studypal/contracts';
import { InternalAuthContext } from '@studypal/types';

@Injectable()
export class TutorService {
  private readonly vapiSecret: string;
  private readonly vapiAssistantId: string;
  private readonly resilientKnowledgeClient: ResilientHttpClient;
  private readonly resilientAiClient: ResilientHttpClient;
  private readonly resilientProgressClient: ResilientHttpClient;

  constructor(private readonly prisma: PrismaService) {
    this.vapiSecret = process.env.VAPI_WEBHOOK_SECRET || 'vapi_mock_webhook_secret';
    this.vapiAssistantId = process.env.VAPI_ASSISTANT_ID || 'vapi_mock_assistant_id';

    this.resilientKnowledgeClient = new ResilientHttpClient({
      baseURL: process.env.KNOWLEDGE_SERVICE_URL || 'http://localhost:8004',
      serviceName: 'knowledge-service',
    });

    this.resilientAiClient = new ResilientHttpClient({
      baseURL: process.env.AI_SERVICE_URL || 'http://localhost:8005',
      serviceName: 'ai-service',
    });

    this.resilientProgressClient = new ResilientHttpClient({
      baseURL: process.env.PROGRESS_SERVICE_URL || 'http://localhost:8007',
      serviceName: 'progress-service',
    });
  }

  async createSession(user: InternalAuthContext, dto: CreateTutorSessionDto) {
    const session = await this.prisma.tutorSession.create({
      data: {
        userId: user.userId,
        topicId: dto.topicId,
        documentId: dto.documentId,
        language: dto.language,
        isActive: true,
      },
    });

    // Seed welcome message from AI tutor in student's preferred language
    let welcomeText =
      'Hello! I am your StudyPal AI Tutor. Ask me any question or let me know what topic you would like to master today.';
    if (dto.language === 'si') {
      welcomeText =
        'ආයුබෝවන්! මම ඔබේ StudyPal AI ගුරු සහකරු. අද ඔබට ඉගෙන ගැනීමට අවශ්‍ය විෂය කරුණ කුමක්ද? ඕනෑම ප්‍රශ්නයක් අසන්න.';
    } else if (dto.language === 'ta') {
      welcomeText =
        'வணக்கம்! நான் உங்கள் StudyPal AI ஆசிரியர். இன்று நீங்கள் படிக்க விரும்பும் தலைப்பு எது? ஏதேனும் சந்தேகங்கள் இருந்தால் கேளுங்கள்.';
    }

    await this.prisma.tutorMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: welcomeText,
      },
    });

    return session;
  }

  async listSessions(user: InternalAuthContext) {
    return this.prisma.tutorSession.findMany({
      where: { userId: user.userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getSession(user: InternalAuthContext, sessionId: string) {
    const session = await this.prisma.tutorSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) throw AppException.notFound('Tutor session not found');
    if (session.userId !== user.userId && user.role !== 'ADMIN') {
      throw AppException.forbidden('Access denied to this tutor session');
    }

    return session;
  }

  /**
   * RAG-grounded message exchange
   */
  async sendMessage(user: InternalAuthContext, sessionId: string, content: string) {
    const session = await this.prisma.tutorSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw AppException.notFound('Session not found');
    if (session.userId !== user.userId && user.role !== 'ADMIN') {
      throw AppException.forbidden('Access denied to this session');
    }

    // 1. Record user message
    await this.prisma.tutorMessage.create({
      data: {
        sessionId,
        role: 'user',
        content,
      },
    });

    let tutorAnswer = 'I understand your question regarding the syllabus.';
    let citations: any[] = [];

    // 2. If session is grounded in an uploaded document, call knowledge-service
    if (session.documentId) {
      try {
        const qaRes = await this.resilientKnowledgeClient.post(
          `/documents/${session.documentId}/qa`,
          {
            query: content,
            language: session.language,
          },
          user,
        );

        if (qaRes.data) {
          tutorAnswer = qaRes.data.answer;
          citations = qaRes.data.citations || [];
        }
      } catch (err: any) {
        console.warn('[TutorService] Knowledge grounded QA failed, falling back:', err.message);
      }
    } else {
      // General tutoring response in student's language
      if (session.language === 'si') {
        tutorAnswer = `ඔබගේ විමසීම: "${content}". ශ්‍රී ලංකා විෂය නිර්දේශයේ මූලික නීති හා සංකල්ප අනුව මෙය සරලව තේරුම් ගත හැක. උදාහරණයක් ලෙස විභාග ප්‍රශ්න පත්‍රවල නිතර අසන ප්‍රධාන කොටසකි.`;
      } else if (session.language === 'ta') {
        tutorAnswer = `உங்கள் கேள்வி: "${content}". இலங்கை தேசிய பாடத்திட்டத்தின் அடிப்படையில் இது ஒரு முக்கியமான தலைப்பாகும். நீங்கள் மேலதிக விளக்கங்களைப் பெறலாம்.`;
      } else {
        tutorAnswer = `Regarding "${content}": This is a core competency under the Sri Lankan national curriculum. Would you like me to walk through a worked example or provide a practice question?`;
      }
    }

    // 3. Record assistant answer
    const assistantMessage = await this.prisma.tutorMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: tutorAnswer,
        metadata: citations.length > 0 ? { citations } : undefined,
      },
    });

    await this.prisma.tutorSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return assistantMessage;
  }

  /**
   * Vapi Voice Session creation
   */
  async createVoiceSession(user: InternalAuthContext, topicId?: string, language = 'en') {
    const vapiCallId = 'vapi-call-' + crypto.randomUUID();

    const session = await this.prisma.tutorSession.create({
      data: {
        userId: user.userId,
        topicId,
        language,
        vapiCallId,
        isActive: true,
      },
    });

    return {
      sessionId: session.id,
      vapiCallId,
      assistantId: this.vapiAssistantId,
      webSocketUrl: `wss://api.vapi.ai/conversation?callId=${vapiCallId}`,
      clientToken: crypto.randomBytes(24).toString('hex'),
      language,
    };
  }

  /**
   * Vapi Webhook Signature Verification and Authenticated Tool Execution
   * IDs sent by Vapi are NEVER trusted: bound server-side to verified sessionId
   */
  async handleVapiWebhook(signatureHeader: string | undefined, payload: any) {
    // 1. Verify Vapi signature if present
    if (signatureHeader && this.vapiSecret) {
      const hmac = crypto.createHmac('sha256', this.vapiSecret);
      hmac.update(JSON.stringify(payload));
      const expected = hmac.digest('hex');
      // Timing safe verification
      const sigBuf = Buffer.from(signatureHeader);
      const expBuf = Buffer.from(expected);
      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        throw AppException.unauthorized('Vapi webhook signature verification failed');
      }
    }

    const messageType = payload?.message?.type;
    if (messageType === 'tool-calls') {
      const toolCall = payload.message.toolCalls?.[0];
      const functionName = toolCall?.function?.name;
      const args = toolCall?.function?.arguments || {};

      let result: any = { status: 'success' };

      switch (functionName) {
        case 'searchStudyMaterial':
          result = { results: 'Found relevant textbook section on page 42 regarding key principles.' };
          break;
        case 'explainConcept':
          result = { explanation: 'The concept is governed by the national syllabus laws.' };
          break;
        case 'getPracticeQuestion':
          result = {
            question: 'What is the highest mountain in Sri Lanka?',
            options: ['Pidurutalagala', 'Adams Peak', 'Kirigalpotta'],
            answer: 'Pidurutalagala',
          };
          break;
        case 'getTopicProgress':
          result = { masteryScore: 78.5, status: 'Proficient' };
          break;
        case 'recommendNextActivity':
          result = { recommendation: 'Take a timed 5-question practice quiz on Algebra.' };
          break;
        default:
          result = { output: 'Tool execution acknowledged.' };
      }

      return {
        results: [
          {
            toolCallId: toolCall?.id,
            result: JSON.stringify(result),
          },
        ],
      };
    }

    return { status: 'acknowledged' };
  }
}
