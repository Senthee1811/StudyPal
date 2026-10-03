import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service.js';
import { InternalAuthGuard, CurrentUser } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';
import { GroundedQaRequestSchema } from '@studypal/contracts';
import { AppException } from '@studypal/service-kit';

@Controller()
@UseGuards(InternalAuthGuard)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post('documents/:id/summaries')
  async getSummaries(@Param('id') documentId: string, @CurrentUser() user: InternalAuthContext) {
    const data = await this.knowledgeService.getSummaries(documentId, user.userId);
    return { success: true, data };
  }

  @Post('documents/:id/qa')
  async askGroundedQuestion(
    @Param('id') documentId: string,
    @CurrentUser() user: InternalAuthContext,
    @Body() body: any,
  ) {
    const parsed = GroundedQaRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid Grounded Q&A query', parsed.error.format());
    }
    const data = await this.knowledgeService.answerGroundedQuestion(
      documentId,
      user.userId,
      parsed.data.query,
      parsed.data.language,
    );
    return { success: true, data };
  }

  @Post('internal/retrieve')
  async retrieveChunks(
    @CurrentUser() user: InternalAuthContext,
    @Body() body: { documentId: string; keywords?: string[]; limit?: number },
  ) {
    const data = await this.knowledgeService.retrieveInternalChunks(
      body.documentId,
      user.userId,
      body.keywords || [],
      body.limit || 5,
    );
    return { success: true, data };
  }
}
