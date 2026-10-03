import { Module } from '@nestjs/common';
import { KnowledgeController } from './knowledge.controller.js';
import { KnowledgeService } from './knowledge.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  controllers: [KnowledgeController, HealthController],
  providers: [KnowledgeService, PrismaService],
  exports: [KnowledgeService, PrismaService],
})
export class KnowledgeModule {}
