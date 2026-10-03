import { Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service.js';
import { GatewayJwtGuard } from '../auth/jwt.guard.js';

@Controller('geography')
@UseGuards(GatewayJwtGuard)
export class GeographyGatewayController {
  private readonly contentUrl: string;

  constructor(private readonly proxy: ProxyService) {
    this.contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:8002';
  }

  @Get('features')
  async getFeatures(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.contentUrl, '/geography/features', req);
    return res.json(data);
  }

  @Get('questions')
  async getQuestions(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.contentUrl, '/geography/questions', req);
    return res.json(data);
  }

  @Post('attempts')
  async submitGeographyAttempt(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.contentUrl, '/geography/attempts', req);
    return res.status(201).json(data);
  }
}
