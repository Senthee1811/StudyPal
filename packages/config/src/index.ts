import { z } from 'zod';

export const CommonEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8000),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  ENABLE_TRACING: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
});

export const GatewayEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8000),
  WEB_ORIGIN: z.string().default('http://localhost:3000'),
  JWT_ACCESS_SECRET: z.string().min(16),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  IDENTITY_SERVICE_URL: z.string().url().default('http://localhost:8001'),
  CONTENT_SERVICE_URL: z.string().url().default('http://localhost:8002'),
  DOCUMENT_SERVICE_URL: z.string().url().default('http://localhost:8003'),
  KNOWLEDGE_SERVICE_URL: z.string().url().default('http://localhost:8004'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8005'),
  ASSESSMENT_SERVICE_URL: z.string().url().default('http://localhost:8006'),
  PROGRESS_SERVICE_URL: z.string().url().default('http://localhost:8007'),
  TUTOR_SERVICE_URL: z.string().url().default('http://localhost:8008'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

export const IdentityEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8001),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRATION_SECONDS: z.coerce.number().default(900), // 15 mins
  JWT_REFRESH_EXPIRATION_SECONDS: z.coerce.number().default(604800), // 7 days
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

export const ContentEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8002),
  DATABASE_URL: z.string().min(1),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

export const DocumentEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8003),
  DATABASE_URL: z.string().min(1),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  S3_ENDPOINT: z.string().default('http://localhost:9000'),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY: z.string().default('minioadmin'),
  S3_SECRET_KEY: z.string().default('minioadmin'),
  S3_BUCKET_NAME: z.string().default('studypal-documents'),
  S3_FORCE_PATH_STYLE: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),
});

export const KnowledgeEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8004),
  DATABASE_URL: z.string().min(1),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8005'),
  S3_ENDPOINT: z.string().default('http://localhost:9000'),
  S3_ACCESS_KEY: z.string().default('minioadmin'),
  S3_SECRET_KEY: z.string().default('minioadmin'),
  S3_BUCKET_NAME: z.string().default('studypal-documents'),
  EMBEDDING_DIMENSIONS: z.coerce.number().default(1536),
});

export const AiEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8005),
  DATABASE_URL: z.string().min(1),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  AI_PROVIDER: z.enum(['mock', 'openai', 'gemini']).default('mock'),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  EMBEDDING_DIMENSIONS: z.coerce.number().default(1536),
  AI_DAILY_TOKEN_QUOTA: z.coerce.number().default(100000),
});

export const AssessmentEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8006),
  DATABASE_URL: z.string().min(1),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  KNOWLEDGE_SERVICE_URL: z.string().url().default('http://localhost:8004'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8005'),
});

export const ProgressEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8007),
  DATABASE_URL: z.string().min(1),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

export const TutorEnvSchema = CommonEnvSchema.extend({
  PORT: z.coerce.number().default(8008),
  DATABASE_URL: z.string().min(1),
  INTERNAL_SERVICE_SECRET: z.string().min(16),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  KNOWLEDGE_SERVICE_URL: z.string().url().default('http://localhost:8004'),
  AI_SERVICE_URL: z.string().url().default('http://localhost:8005'),
  ASSESSMENT_SERVICE_URL: z.string().url().default('http://localhost:8006'),
  PROGRESS_SERVICE_URL: z.string().url().default('http://localhost:8007'),
  VAPI_API_KEY: z.string().default('vapi_mock_key'),
  VAPI_ASSISTANT_ID: z.string().default('vapi_mock_assistant_id'),
  VAPI_WEBHOOK_SECRET: z.string().default('vapi_mock_webhook_secret'),
});

export function validateEnv<T extends z.ZodTypeAny>(schema: T, env: Record<string, any> = process.env): z.infer<T> {
  const result = schema.safeParse(env);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `[${e.path.join('.')}]: ${e.message}`).join(', ');
    throw new Error(`Environment validation failed at startup: ${errorDetails}`);
  }
  return result.data;
}
