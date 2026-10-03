import { Module } from '@nestjs/common';
import { TutorController } from './tutor.controller.js';
import { TutorService } from './tutor.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  controllers: [TutorController, HealthController],
  providers: [TutorService, PrismaService],
  exports: [TutorService, PrismaService],
})
export class TutorModule {}
