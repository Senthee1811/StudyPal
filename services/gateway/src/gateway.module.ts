import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProxyService } from './proxy/proxy.service.js';
import { AuthGatewayController } from './controllers/auth.gateway.controller.js';
import { CurriculumGatewayController } from './controllers/curriculum.gateway.controller.js';
import { DocumentGatewayController } from './controllers/document.gateway.controller.js';
import { AssessmentGatewayController } from './controllers/assessment.gateway.controller.js';
import { ProgressGatewayController } from './controllers/progress.gateway.controller.js';
import { TutorGatewayController } from './controllers/tutor.gateway.controller.js';
import { GeographyGatewayController } from './controllers/geography.gateway.controller.js';
import { HealthController } from '@studypal/service-kit';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 120, // 120 requests per minute by default
      },
      {
        name: 'auth',
        ttl: 60000,
        limit: 15, // 15 auth requests per minute
      },
    ]),
  ],
  controllers: [
    AuthGatewayController,
    CurriculumGatewayController,
    DocumentGatewayController,
    AssessmentGatewayController,
    ProgressGatewayController,
    TutorGatewayController,
    GeographyGatewayController,
    HealthController,
  ],
  providers: [
    ProxyService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class GatewayModule {}
