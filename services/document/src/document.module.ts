import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller.js';
import { DocumentService } from './document.service.js';
import { StorageService } from './storage.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  controllers: [DocumentController, HealthController],
  providers: [DocumentService, StorageService, PrismaService],
  exports: [DocumentService, StorageService, PrismaService],
})
export class DocumentModule {}
