import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { InternalAuthGuard, CurrentUser } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';
import { GenerateQuestionsOptions, GroundedQaOptions } from './providers/ai-provider.interface.js';

@Controller('ai')
@UseGuards(InternalAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-questions')
  async generateQuestions(
    @CurrentUser() user: InternalAuthContext,
    @Body() body: GenerateQuestionsOptions,
  ) {
    const data = await this.aiService.generateQuestions(user.userId, body);
    return { success: true, data };
  }

  @Post('summarize')
  async summarize(
    @CurrentUser() user: InternalAuthContext,
    @Body() body: { text: string; language?: 'si' | 'ta' | 'en'; isDocumentLevel?: boolean },
  ) {
    const data = await this.aiService.generateSummary(
      user.userId,
      body.text,
      body.language || 'en',
      body.isDocumentLevel,
    );
    return { success: true, data };
  }

  @Post('grounded-qa')
  async groundedQa(@CurrentUser() user: InternalAuthContext, @Body() body: GroundedQaOptions) {
    const data = await this.aiService.generateGroundedAnswer(user.userId, body);
    return { success: true, data };
  }

  @Post('embeddings')
  async createEmbeddings(@Body() body: { texts: string[]; dimensions?: number }) {
    const data = await this.aiService.createEmbeddings(body.texts, body.dimensions);
    return { success: true, data };
  }

  @Get('quota-status')
  async getQuotaStatus(@CurrentUser() user: InternalAuthContext) {
    const data = await this.aiService.getQuotaStatus(user.userId);
    return { success: true, data };
  }
}
