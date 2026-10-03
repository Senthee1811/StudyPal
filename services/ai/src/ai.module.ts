import { Module } from '@nestjs/common';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { QuotaService } from './quota.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  controllers: [AiController, HealthController],
  providers: [AiService, QuotaService, PrismaService],
  exports: [AiService, QuotaService, PrismaService],
})
export class AiModule {}
