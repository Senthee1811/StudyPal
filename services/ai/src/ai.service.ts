import { Injectable } from '@nestjs/common';
import { GenerateQuestionsOptions, GroundedQaOptions } from './providers/ai-provider.interface.js';
import { QuotaService } from './quota.service.js';
import { GatewayRouterService } from './gateway/gateway-router.service.js';
import { PromptRegistryService } from './gateway/prompt-registry.service.js';
import {
  GatewayChatRequest,
  GatewayChatResponse,
  GatewayEmbedRequest,
  GatewayEmbedResponse,
  GatewayStructuredRequest,
  GatewayStructuredResponse,
} from './gateway/llm-provider.interface.js';
import { z } from 'zod';

@Injectable()
export class AiService {
  constructor(
    private readonly router: GatewayRouterService,
    private readonly promptRegistry: PromptRegistryService,
    private readonly quotaService: QuotaService,
  ) {}

  // ---------------------------------------------------------------------------
  // Central Gateway Methods
  // ---------------------------------------------------------------------------

  async chat(request: GatewayChatRequest): Promise<GatewayChatResponse> {
    if (request.userId) {
      await this.quotaService.checkAndIncrementQuota(request.userId, 400);
    }
    return this.router.chat(request);
  }

  stream(request: GatewayChatRequest) {
    return this.router.stream(request);
  }

  async embed(request: GatewayEmbedRequest): Promise<GatewayEmbedResponse> {
    return this.router.embed(request);
  }

  async structured<T>(request: GatewayStructuredRequest<T>): Promise<GatewayStructuredResponse<T>> {
    if (request.userId) {
      await this.quotaService.checkAndIncrementQuota(request.userId, 600);
    }
    return this.router.structured<T>(request);
  }

  // ---------------------------------------------------------------------------
  // Backward-Compatible Task Endpoints (Used by internal HTTP microservices)
  // ---------------------------------------------------------------------------

  async generateQuestions(userId: string, options: GenerateQuestionsOptions) {
    const estimatedTokens = options.numQuestions * 300;
    await this.quotaService.checkAndIncrementQuota(userId, estimatedTokens);

    const questionSchema = z.object({
      questions: z.array(
        z.object({
          id: z.string(),
          prompt: z.string(),
          options: z.array(z.string()),
          correctAnswer: z.string(),
          explanation: z.string(),
          difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
          marks: z.number(),
        }),
      ),
    });

    const promptContext = options.contextTexts.map((c) => `[Page ${c.pageNumber}] ${c.text}`).join('\n\n');
    const { system, user } = this.promptRegistry.getPrompt('question_gen', options.language, {
      numQuestions: options.numQuestions,
      topic: options.topicId,
      difficulty: options.difficulty,
      context: promptContext,
    });

    const res = await this.router.structured<{ questions: any[] }>({
      userId,
      task: 'question_gen',
      language: options.language,
      prompt: user,
      systemPrompt: system,
      schema: questionSchema,
      schemaName: 'GeneratedQuestions',
    });

    return res.data?.questions || [];
  }

  async generateSummary(
    userId: string,
    text: string,
    language: 'si' | 'ta' | 'en' = 'en',
    isDocumentLevel = false,
  ) {
    const estimatedTokens = Math.min(2000, Math.ceil(text.length / 4));
    await this.quotaService.checkAndIncrementQuota(userId, estimatedTokens);

    const prompt = isDocumentLevel
      ? `Provide a concise 3-4 sentence high-level overview of the entire study material:\n\n${text}`
      : `Summarize the following textbook section into key concepts and learning outcomes:\n\n${text}`;

    const res = await this.router.chat({
      userId,
      task: 'summarize',
      language,
      messages: [
        {
          role: 'system',
          content: 'You are a curriculum summarizer for Sri Lankan school students.',
        },
        { role: 'user', content: prompt },
      ],
    });

    return res.content;
  }

  async generateGroundedAnswer(userId: string, options: GroundedQaOptions) {
    const estimatedTokens = 500;
    await this.quotaService.checkAndIncrementQuota(userId, estimatedTokens);

    const contextFormatted = options.contextChunks
      .map((c) => `[Page ${c.pageNumber}] ${c.text}`)
      .join('\n\n');

    const { system, user } = this.promptRegistry.getPrompt('grounded_qa', options.language, {
      query: options.query,
      context: contextFormatted,
    });

    const res = await this.router.chat({
      userId,
      task: 'grounded_qa',
      language: options.language,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    return {
      answer: res.content,
      isUncertain: res.content.toLowerCase().includes('not found') || res.content.toLowerCase().includes('uncertain'),
      citations: options.contextChunks.slice(0, 3).map((c) => ({
        pageNumber: c.pageNumber,
        snippet: c.text.substring(0, 150),
      })),
    };
  }

  async createEmbeddings(texts: string[], dimensions?: number) {
    const res = await this.router.embed({ texts, dimensions });
    return res.embeddings;
  }

  async getQuotaStatus(userId: string) {
    return this.quotaService.getQuotaStatus(userId);
  }
}
