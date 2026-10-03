import { Controller, Get, Post, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service.js';
import { InternalAuthGuard, RolesGuard, Roles, CurrentUser, Public } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';

@Controller('curriculum')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get()
  async getCurriculums() {
    const data = await this.contentService.getCurriculums();
    return { success: true, data };
  }

  @Public()
  @Get('topics')
  async getTopics(
    @Query('subjectId') subjectId?: string,
    @Query('language') language = 'en',
    @Query('grade') grade?: string,
  ) {
    const data = await this.contentService.getTopics(
      subjectId,
      language,
      grade ? Number(grade) : undefined,
    );
    return { success: true, data };
  }

  @Public()
  @Get('topics/:id')
  async getTopicById(@Param('id') id: string) {
    const data = await this.contentService.getTopicById(id);
    return { success: true, data };
  }

  @Public()
  @Get('questions/official')
  async getOfficialQuestions(
    @Query('topicId') topicId?: string,
    @Query('language') language = 'en',
    @Query('limit') limit?: string,
  ) {
    const data = await this.contentService.getOfficialQuestions(
      topicId,
      language,
      limit ? Number(limit) : 20,
    );
    return { success: true, data };
  }

  @UseGuards(InternalAuthGuard, RolesGuard)
  @Roles('CONTENT_REVIEWER', 'ADMIN')
  @Post('questions/:id/review')
  async reviewQuestion(
    @Param('id') id: string,
    @CurrentUser() user: InternalAuthContext,
    @Body() body: { status: 'APPROVED' | 'REJECTED' | 'IN_REVIEW'; reviewNotes?: string },
  ) {
    const data = await this.contentService.reviewQuestion(
      id,
      user.userId,
      body.status,
      body.reviewNotes,
    );
    return { success: true, data };
  }
}
