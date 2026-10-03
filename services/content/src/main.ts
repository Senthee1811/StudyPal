import { NestFactory } from '@nestjs/core';
import { ContentModule } from './content.module.js';
import { validateEnv, ContentEnvSchema } from '@studypal/config';
import {
  GlobalExceptionFilter,
  CorrelationIdMiddleware,
  JsonLogger,
  HealthController,
} from '@studypal/service-kit';
import { PrismaService } from './prisma.service.js';

async function bootstrap() {
  const env = validateEnv(ContentEnvSchema);
  const logger = new JsonLogger('content-service');

  const app = await NestFactory.create(ContentModule, {
    logger,
  });

  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const prisma = app.get(PrismaService);
  HealthController.registerReadinessChecker({
    name: 'database:content',
    check: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch (_) {
        return false;
      }
    },
  });

  const port = env.PORT || 8002;
  await app.listen(port);
  logger.log(`content-service started on port ${port} in ${env.NODE_ENV} mode`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error in content-service:', err);
  process.exit(1);
});
