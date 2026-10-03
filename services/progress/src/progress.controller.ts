import { Controller, Get, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service.js';
import { InternalAuthGuard, CurrentUser } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';

@Controller()
@UseGuards(InternalAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('progress')
  async getMyProgress(@CurrentUser() user: InternalAuthContext) {
    const data = await this.progressService.getProgress(user.userId);
    return { success: true, data };
  }

  @Get('recommendations')
  async getMyRecommendations(@CurrentUser() user: InternalAuthContext) {
    const data = await this.progressService.getRecommendations(user.userId);
    return { success: true, data };
  }
}
