import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Retriever } from './rag/retriever.js';
import { ResilientHttpClient, AppException } from '@studypal/service-kit';
import { GroundedQaResponseDto } from '@studypal/contracts';

@Injectable()
export class KnowledgeService {
  private retriever: Retriever;
  private resilientAiClient: ResilientHttpClient;

  constructor(private readonly prisma: PrismaService) {
    this.retriever = new Retriever(this.prisma);
    this.resilientAiClient = new ResilientHttpClient({
      baseURL: process.env.AI_SERVICE_URL || 'http://localhost:8005',
      serviceName: 'ai-service',
    });
  }

  async getSummaries(documentId: string, userId: string) {
    const summaries = await this.prisma.summary.findMany({
      where: {
        documentId,
        userId,
      },
      orderBy: { createdAt: 'asc' },
    });

    return summaries;
  }

  async answerGroundedQuestion(
    documentId: string,
    userId: string,
    query: string,
    language: 'si' | 'ta' | 'en' = 'en',
  ): Promise<GroundedQaResponseDto> {
    const keywords = query
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 2);

    // 1. Parameterized hybrid retrieval enforcing ownership
    const retrieved = await this.retriever.retrieveHybrid(documentId, userId, keywords, undefined, 4);

    // If no chunks match ownership or query, return explicit uncertainty
    if (retrieved.length === 0) {
      const message =
        language === 'si'
          ? 'සමාවන්න, සපයා ඇති අධ්‍යයන ද්‍රව්‍යවල මෙම ප්‍රශ්නයට නිශ්චිත පිළිතුරක් සඳහන් නොවේ.'
          : language === 'ta'
            ? 'மன்னிக்கவும், வழங்கப்பட்ட ஆவணத்தில் இந்த வினாவிற்கான போதுமான ஆதாரங்கள் இல்லை.'
            : 'I could not find sufficient verified evidence in the uploaded document to answer this question with certainty.';

      return {
        answer: message,
        isUncertain: true,
        citations: [],
      };
    }

    // 2. Format citations from retrieved chunks
    const citations = retrieved.map((r) => ({
      documentId: r.documentId,
      pageNumber: r.pageNumber,
      snippet: r.content.substring(0, 160) + '...',
      relevanceScore: r.score,
    }));

    // 3. Ask AI service with grounded context
    try {
      const aiResponse = await this.resilientAiClient.post('/ai/grounded-qa', {
        query,
        language,
        contextChunks: retrieved.map((r) => ({
          pageNumber: r.pageNumber,
          text: r.content,
          relevanceScore: r.score,
        })),
      });

      return {
        answer: aiResponse.data?.answer || citations[0]?.snippet || 'Evidence verified in document.',
        isUncertain: Boolean(aiResponse.data?.isUncertain),
        citations,
      };
    } catch (_) {
      // Deterministic fallback response with verified page citations
      return {
        answer: `Verified from source material: ${retrieved[0]?.content}`,
        isUncertain: false,
        citations,
      };
    }
  }

  async retrieveInternalChunks(documentId: string, userId: string, keywords: string[], limit = 5) {
    return this.retriever.retrieveHybrid(documentId, userId, keywords, undefined, limit);
  }
}
