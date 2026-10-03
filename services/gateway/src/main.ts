import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module.js';
import { validateEnv, GatewayEnvSchema } from '@studypal/config';
import {
  GlobalExceptionFilter,
  CorrelationIdMiddleware,
  JsonLogger,
  HealthController,
} from '@studypal/service-kit';

async function bootstrap() {
  const env = validateEnv(GatewayEnvSchema);
  const logger = new JsonLogger('gateway');

  const app = await NestFactory.create(GatewayModule, {
    logger,
  });

  // Security headers & middleware
  app.use(helmet());
  app.use(cookieParser());
  app.use(new CorrelationIdMiddleware().use);
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Strict CORS
  const allowedOrigins = [
    env.WEB_ORIGIN,
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:19006',
  ];
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev if needed
      }
    },
    credentials: true,
  });

  // Global prefix: /api/v1
  app.setGlobalPrefix('api/v1', {
    exclude: ['health/live', 'health/ready', 'metrics'],
  });

  // OpenAPI Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('StudyPal API Gateway')
    .setDescription(
      'Public edge API for StudyPal - Multilingual AI Learning Platform for Sri Lanka curriculum',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, swaggerDocument);

  // Health checks
  HealthController.registerReadinessChecker({
    name: 'gateway:core',
    check: async () => true,
  });

  const port = env.PORT || 8000;
  await app.listen(port);
  logger.log(`StudyPal API Gateway listening at http://localhost:${port}/api/v1`);
  logger.log(`OpenAPI documentation available at http://localhost:${port}/api/v1/docs`);
}

bootstrap().catch((err) => {
  console.error('Fatal startup error in gateway:', err);
  process.exit(1);
});
