import { Module } from '@nestjs/common';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { QuotaService } from './quota.service.js';
import { PrismaService } from './prisma.service.js';
import { HealthController } from '@studypal/service-kit';
import { GatewayRouterService } from './gateway/gateway-router.service.js';
import { PromptRegistryService } from './gateway/prompt-registry.service.js';
import { MeteringService } from './gateway/metering.service.js';
import { GatewayCacheService } from './gateway/cache.service.js';

@Module({
  controllers: [AiController, HealthController],
  providers: [
    AiService,
    QuotaService,
    PrismaService,
    GatewayRouterService,
    PromptRegistryService,
    MeteringService,
    GatewayCacheService,
  ],
  exports: [
    AiService,
    QuotaService,
    PrismaService,
    GatewayRouterService,
    PromptRegistryService,
    MeteringService,
  ],
})
export class AiModule {}
