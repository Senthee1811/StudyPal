import { NestFactory } from '@nestjs/core';
import { AiModule } from './ai.module.js';
import { validateEnv, AiEnvSchema } from '@studypal/config';
import {
  GlobalExceptionFilter,
  CorrelationIdMiddleware,
  JsonLogger,
  HealthController,
} from '@studypal/service-kit';
import { PrismaService } from './prisma.service.js';

async function bootstrap() {
  const env = validateEnv(AiEnvSchema);
  const logger = new JsonLogger('ai-service');

  const app = await NestFactory.create(AiModule, {
    logger,
  });

  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const prisma = app.get(PrismaService);
  HealthController.registerReadinessChecker({
    name: 'database:ai',
    check: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch (_) {
        return false;
      }
    },
  });

  const port = env.PORT || 8005;
  await app.listen(port);
  logger.log(`ai-service started on port ${port} in ${env.NODE_ENV} mode`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error in ai-service:', err);
  process.exit(1);
});
