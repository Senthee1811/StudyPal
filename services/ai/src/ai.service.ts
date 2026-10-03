import { Injectable } from '@nestjs/common';
import { IAiProvider, GenerateQuestionsOptions, GroundedQaOptions } from './providers/ai-provider.interface.js';
import { MockAiProvider } from './providers/mock-ai.provider.js';
import { QuotaService } from './quota.service.js';

@Injectable()
export class AiService {
  private readonly provider: IAiProvider;

  constructor(private readonly quotaService: QuotaService) {
    // Configurable provider adapter (mock / openai / gemini)
    this.provider = new MockAiProvider();
  }

  async generateQuestions(userId: string, options: GenerateQuestionsOptions) {
    const estimatedTokens = options.numQuestions * 300;
    await this.quotaService.checkAndIncrementQuota(userId, estimatedTokens);

    return this.provider.generateQuestions(options);
  }

  async generateSummary(
    userId: string,
    text: string,
    language: 'si' | 'ta' | 'en' = 'en',
    isDocumentLevel = false,
  ) {
    const estimatedTokens = Math.min(2000, Math.ceil(text.length / 4));
    await this.quotaService.checkAndIncrementQuota(userId, estimatedTokens);

    return this.provider.generateSummary(text, language, isDocumentLevel);
  }

  async generateGroundedAnswer(userId: string, options: GroundedQaOptions) {
    const estimatedTokens = 500;
    await this.quotaService.checkAndIncrementQuota(userId, estimatedTokens);

    return this.provider.generateGroundedAnswer(options);
  }

  async createEmbeddings(texts: string[], dimensions?: number) {
    return this.provider.createEmbeddings(texts, dimensions);
  }

  async getQuotaStatus(userId: string) {
    return this.quotaService.getQuotaStatus(userId);
  }
}
