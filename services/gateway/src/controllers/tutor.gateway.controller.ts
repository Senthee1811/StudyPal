import { Controller, Post, Get, Req, Res, Param, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service.js';
import { GatewayJwtGuard, Public } from '../auth/jwt.guard.js';

@Controller()
@UseGuards(GatewayJwtGuard)
export class TutorGatewayController {
  private readonly tutorUrl: string;

  constructor(private readonly proxy: ProxyService) {
    this.tutorUrl = process.env.TUTOR_SERVICE_URL || 'http://localhost:8008';
  }

  @Post('tutor/sessions')
  async createSession(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.tutorUrl, '/tutor/sessions', req);
    return res.status(201).json(data);
  }

  @Get('tutor/sessions')
  async listSessions(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.tutorUrl, '/tutor/sessions', req);
    return res.json(data);
  }

  @Get('tutor/sessions/:id')
  async getSession(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.tutorUrl, `/tutor/sessions/${id}`, req);
    return res.json(data);
  }

  @Post('tutor/sessions/:id/messages')
  async sendMessage(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.tutorUrl, `/tutor/sessions/${id}/messages`, req);
    return res.json(data);
  }

  @Post('voice/sessions')
  async createVoiceSession(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.tutorUrl, '/voice/sessions', req);
    return res.status(201).json(data);
  }

  @Public()
  @Post('tutor/vapi-webhook')
  async vapiWebhook(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.tutorUrl, '/vapi/webhook', req);
    return res.json(data);
  }
}
