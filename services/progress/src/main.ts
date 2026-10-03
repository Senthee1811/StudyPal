import { NestFactory } from '@nestjs/core';
import { ProgressModule } from './progress.module.js';
import { validateEnv, ProgressEnvSchema } from '@studypal/config';
import {
  GlobalExceptionFilter,
  CorrelationIdMiddleware,
  JsonLogger,
  HealthController,
} from '@studypal/service-kit';
import { PrismaService } from './prisma.service.js';

async function bootstrap() {
  const env = validateEnv(ProgressEnvSchema);
  const logger = new JsonLogger('progress-service');

  const app = await NestFactory.create(ProgressModule, {
    logger,
  });

  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const prisma = app.get(PrismaService);
  HealthController.registerReadinessChecker({
    name: 'database:progress',
    check: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch (_) {
        return false;
      }
    },
  });

  const port = env.PORT || 8007;
  await app.listen(port);
  logger.log(`progress-service started on port ${port} in ${env.NODE_ENV} mode`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error in progress-service:', err);
  process.exit(1);
});
