import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service.js';
import { InternalAuthGuard, Public } from '@studypal/service-kit';

@Controller('geography')
export class GeographyController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get('features')
  async getFeatures() {
    const data = await this.contentService.getGeographyFeatures();
    return { success: true, data };
  }

  @Public()
  @Get('questions')
  async getQuestions(@Query('language') language = 'en') {
    const data = await this.contentService.getGeographyQuestions(language);
    return { success: true, data };
  }

  @UseGuards(InternalAuthGuard)
  @Post('attempts')
  async submitAttempt(@Body() body: { questionId: string; latitude: number; longitude: number }) {
    const data = await this.contentService.evaluateGeographyAttempt(
      body.questionId,
      body.latitude,
      body.longitude,
    );
    return { success: true, data };
  }
}
