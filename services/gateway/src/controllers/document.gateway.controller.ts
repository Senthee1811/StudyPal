import { Controller, Post, Get, Delete, Req, Res, Param, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy/proxy.service.js';
import { GatewayJwtGuard } from '../auth/jwt.guard.js';

@Controller('documents')
@UseGuards(GatewayJwtGuard)
export class DocumentGatewayController {
  private readonly documentUrl: string;
  private readonly knowledgeUrl: string;
  private readonly assessmentUrl: string;

  constructor(private readonly proxy: ProxyService) {
    this.documentUrl = process.env.DOCUMENT_SERVICE_URL || 'http://localhost:8003';
    this.knowledgeUrl = process.env.KNOWLEDGE_SERVICE_URL || 'http://localhost:8004';
    this.assessmentUrl = process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:8006';
  }

  @Post('upload-intents')
  async createUploadIntent(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.documentUrl, '/documents/upload-intents', req);
    return res.status(201).json(data);
  }

  @Post(':id/complete-upload')
  async completeUpload(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.documentUrl, `/documents/${id}/complete-upload`, req);
    return res.json(data);
  }

  @Get()
  async listDocuments(@Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.documentUrl, '/documents', req);
    return res.json(data);
  }

  @Get(':id')
  async getDocument(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.documentUrl, `/documents/${id}`, req);
    return res.json(data);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.documentUrl, `/documents/${id}`, req);
    return res.json(data);
  }

  @Post(':id/summaries')
  async getSummaries(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.knowledgeUrl, `/documents/${id}/summaries`, req);
    return res.json(data);
  }

  @Post(':id/qa')
  async askGroundedQuestion(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.knowledgeUrl, `/documents/${id}/qa`, req);
    return res.json(data);
  }

  @Post(':id/quizzes')
  async generateQuiz(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const data = await this.proxy.forward(this.assessmentUrl, `/quizzes/generate/${id}`, req);
    return res.status(202).json(data);
  }
}
