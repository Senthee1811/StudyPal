import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service.js';
import { GatewayJwtGuard } from '../auth/jwt.guard.js';

@Controller('students/me')
@UseGuards(GatewayJwtGuard)
export class ProgressGatewayController {
  private readonly progressUrl: string;

  constructor(private readonly proxy: ProxyService) {
    this.progressUrl = process.env.PROGRESS_SERVICE_URL || 'http://localhost:8007';
  }

  @Get('progress')
  async getMyProgress(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.progressUrl, '/progress', req);
    return res.json(data);
  }

  @Get('recommendations')
  async getMyRecommendations(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.progressUrl, '/recommendations', req);
    return res.json(data);
  }
}
