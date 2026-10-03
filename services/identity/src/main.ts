import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module.js';
import { validateEnv, IdentityEnvSchema } from '@studypal/config';
import {
  GlobalExceptionFilter,
  CorrelationIdMiddleware,
  JsonLogger,
  HealthController,
} from '@studypal/service-kit';
import { PrismaService } from './prisma.service.js';

async function bootstrap() {
  const env = validateEnv(IdentityEnvSchema);
  const logger = new JsonLogger('identity-service');

  const app = await NestFactory.create(IdentityModule, {
    logger,
  });

  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const prisma = app.get(PrismaService);
  HealthController.registerReadinessChecker({
    name: 'database:identity',
    check: async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
      } catch (_) {
        return false;
      }
    },
  });

  const port = env.PORT || 8001;
  await app.listen(port);
  logger.log(`identity-service started on port ${port} in ${env.NODE_ENV} mode`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error in identity-service:', err);
  process.exit(1);
});
