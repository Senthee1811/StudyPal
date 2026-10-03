import { Controller, Post, Get, Req, Res, Body, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service.js';
import { GatewayJwtGuard, Public } from '../auth/jwt.guard.js';

@Controller()
@UseGuards(GatewayJwtGuard)
export class AuthGatewayController {
  private readonly identityUrl: string;

  constructor(private readonly proxy: ProxyService) {
    this.identityUrl = process.env.IDENTITY_SERVICE_URL || 'http://localhost:8001';
  }

  @Public()
  @Post('auth/register')
  async register(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.identityUrl, '/auth/register', req);
    return res.status(201).json(data);
  }

  @Public()
  @Post('auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.identityUrl, '/auth/login', req);
    return res.status(200).json(data);
  }

  @Public()
  @Post('auth/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.identityUrl, '/auth/refresh', req);
    return res.status(200).json(data);
  }

  @Public()
  @Post('auth/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.identityUrl, '/auth/logout', req);
    return res.status(200).json(data);
  }

  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.identityUrl, '/auth/me', req);
    return res.status(200).json(data);
  }
}
