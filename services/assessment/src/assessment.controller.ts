import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AssessmentService } from './assessment.service.js';
import { InternalAuthGuard, CurrentUser, Public } from '@studypal/service-kit';
import { InternalAuthContext } from '@studypal/types';
import {
  CreateQuizRequestSchema,
  CreateExamRequestSchema,
  SubmitAttemptSchema,
} from '@studypal/contracts';
import { AppException } from '@studypal/service-kit';

@Controller()
@UseGuards(InternalAuthGuard)
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('quizzes/generate/:documentId')
  async generateQuiz(
    @Param('documentId') documentId: string,
    @CurrentUser() user: InternalAuthContext,
    @Body() body: any,
  ) {
    const parsed = CreateQuizRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid quiz generation params', parsed.error.format());
    }
    const data = await this.assessmentService.generateQuizFromDocument(user, documentId, parsed.data);
    return { success: true, data };
  }

  @Public()
  @Get('exams')
  async listExams() {
    const data = await this.assessmentService.listExams();
    return { success: true, data };
  }

  @Public()
  @Get('exams/:id')
  async getExam(@Param('id') id: string) {
    const data = await this.assessmentService.getExam(id);
    return { success: true, data };
  }

  @Post('exams')
  async createExam(@Body() body: any) {
    const parsed = CreateExamRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid exam payload', parsed.error.format());
    }
    const data = await this.assessmentService.createExam(parsed.data);
    return { success: true, data };
  }

  @Post('exams/:id/attempts')
  async startAttempt(@Param('id') id: string, @CurrentUser() user: InternalAuthContext) {
    const data = await this.assessmentService.startAttempt(user, id);
    return { success: true, data };
  }

  @Post('attempts/:id/answers')
  async saveAnswer(
    @Param('id') attemptId: string,
    @Body() body: { questionId: string; studentAnswer: string },
  ) {
    const data = await this.assessmentService.saveAnswer(attemptId, body.questionId, body.studentAnswer);
    return { success: true, data };
  }

  @Post('attempts/:id/submit')
  async submitAttempt(
    @Param('id') attemptId: string,
    @CurrentUser() user: InternalAuthContext,
    @Body() body: any,
  ) {
    const parsed = SubmitAttemptSchema.safeParse(body);
    if (!parsed.success) {
      throw AppException.validationFailed('Invalid attempt submission payload', parsed.error.format());
    }
    const data = await this.assessmentService.submitAndMarkAttempt(user, attemptId, parsed.data);
    return { success: true, data };
  }

  @Get('attempts/:id')
  async getAttempt(@Param('id') attemptId: string, @CurrentUser() user: InternalAuthContext) {
    const data = await this.assessmentService.getAttempt(user, attemptId);
    return { success: true, data };
  }
}
