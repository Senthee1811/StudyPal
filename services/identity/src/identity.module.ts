import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  controllers: [AuthController, HealthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService, PrismaService],
})
export class IdentityModule {}
