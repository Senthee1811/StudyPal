import { Controller, Post, Get, Param, Body, Headers, UseGuards } from '@nestjs/common';
import { TutorService } from './tutor.service.js';
import { InternalAuthGuard, CurrentUser, Public } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';
import { CreateTutorSessionSchema, SendTutorMessageSchema } from '@studypal/contracts';
import { AppException } from '@studypal/service-kit';

@Controller()
@UseGuards(InternalAuthGuard)
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post('tutor/sessions')
  async createSession(@CurrentUser() user: InternalAuthContext, @Body() body: any) {
    const parsed = CreateTutorSessionSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid session params', parsed.error.format());
    }
    const data = await this.tutorService.createSession(user, parsed.data);
    return { success: true, data };
  }

  @Get('tutor/sessions')
  async listSessions(@CurrentUser() user: InternalAuthContext) {
    const data = await this.tutorService.listSessions(user);
    return { success: true, data };
  }

  @Get('tutor/sessions/:id')
  async getSession(@Param('id') sessionId: string, @CurrentUser() user: InternalAuthContext) {
    const data = await this.tutorService.getSession(user, sessionId);
    return { success: true, data };
  }

  @Post('tutor/sessions/:id/messages')
  async sendMessage(
    @Param('id') sessionId: string,
    @CurrentUser() user: InternalAuthContext,
    @Body() body: any,
  ) {
    const parsed = SendTutorMessageSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid message payload', parsed.error.format());
    }
    const data = await this.tutorService.sendMessage(user, sessionId, parsed.data.content);
    return { success: true, data };
  }

  @Post('voice/sessions')
  async createVoiceSession(
    @CurrentUser() user: InternalAuthContext,
    @Body() body: { topicId?: string; language?: string },
  ) {
    const data = await this.tutorService.createVoiceSession(user, body.topicId, body.language);
    return { success: true, data };
  }

  @Public()
  @Post('vapi/webhook')
  async handleVapiWebhook(@Headers('x-vapi-signature') sig: string, @Body() payload: any) {
    const data = await this.tutorService.handleVapiWebhook(sig, payload);
    return data;
  }
}
