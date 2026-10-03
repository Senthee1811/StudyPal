import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service.js';
import { GatewayJwtGuard, Public } from '../auth/jwt.guard.js';

@Controller('curriculum')
@UseGuards(GatewayJwtGuard)
export class CurriculumGatewayController {
  private readonly contentUrl: string;

  constructor(private readonly proxy: ProxyService) {
    this.contentUrl = process.env.CONTENT_SERVICE_URL || 'http://localhost:8002';
  }

  @Public()
  @Get()
  async getCurriculum(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.contentUrl, '/curriculum', req);
    return res.json(data);
  }

  @Public()
  @Get('topics')
  async getTopics(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.contentUrl, '/curriculum/topics', req);
    return res.json(data);
  }
}
