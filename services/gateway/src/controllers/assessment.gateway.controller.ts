import { Controller, Post, Get, Req, Res, Param, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service.js';
import { GatewayJwtGuard } from '../auth/jwt.guard.js';

@Controller()
@UseGuards(GatewayJwtGuard)
export class AssessmentGatewayController {
  private readonly assessmentUrl: string;

  constructor(private readonly proxy: ProxyService) {
    this.assessmentUrl = process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:8006';
  }

  @Get('exams')
  async listExams(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, '/exams', req);
    return res.json(data);
  }

  @Post('exams')
  async createExam(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, '/exams', req);
    return res.status(201).json(data);
  }

  @Get('exams/:id')
  async getExam(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, `/exams/${id}`, req);
    return res.json(data);
  }

  @Post('exams/:id/attempts')
  async startAttempt(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, `/exams/${id}/attempts`, req);
    return res.status(201).json(data);
  }

  @Post('attempts/:id/answers')
  async saveAnswer(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, `/attempts/${id}/answers`, req);
    return res.json(data);
  }

  @Post('attempts/:id/submit')
  async submitAttempt(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, `/attempts/${id}/submit`, req);
    return res.json(data);
  }

  @Get('attempts/:id')
  async getAttempt(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, `/attempts/${id}`, req);
    return res.json(data);
  }

  @Get('quizzes/:id')
  async getQuiz(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, `/quizzes/${id}`, req);
    return res.json(data);
  }

  @Post('quizzes/:id/submit')
  async submitQuiz(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, `/quizzes/${id}/submit`, req);
    return res.json(data);
  }
}
