import { NestFactory } from '@nestjs/core';
import { KnowledgeModule } from './knowledge.module.js';
import { validateEnv, KnowledgeEnvSchema } from '@studypal/config';
import {
  GlobalExceptionFilter,
  CorrelationIdMiddleware,
  JsonLogger,
  HealthController,
} from '@studypal/service-kit';
import { PrismaService } from './prisma.service.js';
import { DocumentWorker } from './worker/document-worker.js';
import { RedisStreamsEventBus, MemoryEventBus } from '@studypal/messaging';

async function bootstrap() {
  const env = validateEnv(KnowledgeEnvSchema);
  const logger = new JsonLogger('knowledge-service');

  const app = await NestFactory.create(KnowledgeModule, {
    logger,
  });

  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const prisma = app.get(PrismaService);
  HealthController.registerReadinessChecker({
    name: 'database:knowledge:pgvector',
    check: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch (_) {
        return false;
      }
    },
  });

  // Start background event worker
  const eventBus =
    env.NODE_ENV === 'test'
      ? new MemoryEventBus()
      : new RedisStreamsEventBus({ redisUrl: env.REDIS_URL });

  const worker = new DocumentWorker(prisma, eventBus);
  worker.startListening().catch((err) => {
    logger.error('Failed to start document worker listener', err.stack);
  });

  const port = env.PORT || 8004;
  await app.listen(port);
  logger.log(`knowledge-service started on port ${port} in ${env.NODE_ENV} mode`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error in knowledge-service:', err);
  process.exit(1);
});
