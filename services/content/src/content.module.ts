import { Module } from '@nestjs/common';
import { ContentController } from './content.controller.js';
import { GeographyController } from './geography.controller.js';
import { ContentService } from './content.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  controllers: [ContentController, GeographyController, HealthController],
  providers: [ContentService, PrismaService],
  exports: [ContentService, PrismaService],
})
export class ContentModule {}
