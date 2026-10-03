import { NestFactory } from '@nestjs/core';
import { AssessmentModule } from './assessment.module.js';
import { validateEnv, AssessmentEnvSchema } from '@studypal/config';
import {
  GlobalExceptionFilter,
  CorrelationIdMiddleware,
  JsonLogger,
  HealthController,
} from '@studypal/service-kit';
import { PrismaService } from './prisma.service.js';

async function bootstrap() {
  const env = validateEnv(AssessmentEnvSchema);
  const logger = new JsonLogger('assessment-service');

  const app = await NestFactory.create(AssessmentModule, {
    logger,
  });

  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const prisma = app.get(PrismaService);
  HealthController.registerReadinessChecker({
    name: 'database:assessment',
    check: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch (_) {
        return false;
      }
    },
  });

  const port = env.PORT || 8006;
  await app.listen(port);
  logger.log(`assessment-service started on port ${port} in ${env.NODE_ENV} mode`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error in assessment-service:', err);
  process.exit(1);
});
