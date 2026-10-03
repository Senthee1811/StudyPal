import { Module } from '@nestjs/common';
import { AssessmentController } from './assessment.controller.js';
import { AssessmentService } from './assessment.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  controllers: [AssessmentController, HealthController],
  providers: [AssessmentService, PrismaService],
  exports: [AssessmentService, PrismaService],
})
export class AssessmentModule {}
