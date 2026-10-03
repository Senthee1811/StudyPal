import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller.js';
import { ProgressService } from './progress.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  controllers: [ProgressController, HealthController],
  providers: [ProgressService, PrismaService],
  exports: [ProgressService, PrismaService],
})
export class ProgressModule {}
