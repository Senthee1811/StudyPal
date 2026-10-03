import { z } from 'zod';

// ==========================================
// AUTH DTOs
// ==========================================
export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  displayName: z.string().min(2).max(60),
  role: z.enum(['STUDENT', 'TEACHER', 'CONTENT_REVIEWER', 'ADMIN']).default('STUDENT'),
  grade: z.number().int().min(1).max(13).optional(),
  language: z.enum(['si', 'ta', 'en']).default('en'),
  parentConsentGiven: z.boolean().default(true),
});
export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshTokenRequestDto = z.infer<typeof RefreshTokenRequestSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    displayName: z.string(),
    role: z.enum(['STUDENT', 'TEACHER', 'CONTENT_REVIEWER', 'ADMIN']),
    language: z.enum(['si', 'ta', 'en']),
    grade: z.number().int().optional().nullable(),
  }),
});
export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;

// ==========================================
// QUESTION CONTRACT (Strict validation per prompt)
// ==========================================
export const QuestionContractSchema = z
  .object({
    id: z.string().uuid().optional(),
    language: z.enum(['si', 'ta', 'en']),
    type: z.enum(['MCQ', 'SHORT_ANSWER', 'STRUCTURED']),
    prompt: z.string().min(5),
    options: z.array(z.string().min(1)).optional(),
    correctAnswer: z.string().min(1),
    explanation: z.string().min(1),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    topicId: z.string().uuid(),
    sourcePages: z.array(z.number().int().positive()).default([]),
    marks: z.number().positive().default(1),
  })
  .superRefine((val, ctx) => {
    if (val.type === 'MCQ') {
      if (!val.options || val.options.length < 3 || val.options.length > 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'MCQ questions must have between 3 and 5 distinct options',
          path: ['options'],
        });
      } else {
        const unique = new Set(val.options.map((o) => o.trim().toLowerCase()));
        if (unique.size !== val.options.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'MCQ options must be unique and have no duplicates',
            path: ['options'],
          });
        }
        if (!val.options.includes(val.correctAnswer)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'MCQ correctAnswer must match one of the provided options exactly',
            path: ['correctAnswer'],
          });
        }
      }
    }
    if (!val.correctAnswer || val.correctAnswer.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Correct answer cannot be missing or empty',
        path: ['correctAnswer'],
      });
    }
  });

export type QuestionContract = z.infer<typeof QuestionContractSchema>;

// ==========================================
// DOCUMENT DTOs
// ==========================================
export const CreateUploadIntentSchema = z.object({
  filename: z.string().min(1),
  fileSize: z.number().int().positive().max(50 * 1024 * 1024), // 50MB max
  mimeType: z.literal('application/pdf'),
  language: z.enum(['si', 'ta', 'en']).default('en'),
  title: z.string().min(1),
  subjectId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
});
export type CreateUploadIntentDto = z.infer<typeof CreateUploadIntentSchema>;

export const UploadIntentResponseSchema = z.object({
  documentId: z.string().uuid(),
  uploadUrl: z.string(),
  expiresInSeconds: z.number().int(),
  requiredHeaders: z.record(z.string()).optional(),
});
export type UploadIntentResponseDto = z.infer<typeof UploadIntentResponseSchema>;

export const CompleteUploadSchema = z.object({
  checksumSha256: z.string().optional(),
});
export type CompleteUploadDto = z.infer<typeof CompleteUploadSchema>;

export const GroundedQaRequestSchema = z.object({
  query: z.string().min(2),
  language: z.enum(['si', 'ta', 'en']).default('en'),
});
export type GroundedQaRequestDto = z.infer<typeof GroundedQaRequestSchema>;

export const GroundedQaResponseSchema = z.object({
  answer: z.string(),
  isUncertain: z.boolean(),
  citations: z.array(
    z.object({
      documentId: z.string().uuid(),
      pageNumber: z.number().int(),
      snippet: z.string(),
      relevanceScore: z.number(),
    }),
  ),
});
export type GroundedQaResponseDto = z.infer<typeof GroundedQaResponseSchema>;

// ==========================================
// ASSESSMENT & EXAM DTOs
// ==========================================
export const CreateQuizRequestSchema = z.object({
  documentId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  numQuestions: z.number().int().min(1).max(20).default(5),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  language: z.enum(['si', 'ta', 'en']).default('en'),
});
export type CreateQuizRequestDto = z.infer<typeof CreateQuizRequestSchema>;

export const CreateExamRequestSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  subjectId: z.string().uuid(),
  durationMinutes: z.number().int().min(5).max(360),
  passPercentage: z.number().min(0).max(100).default(40),
  language: z.enum(['si', 'ta', 'en']).default('en'),
  questionIds: z.array(z.string().uuid()).min(1),
});
export type CreateExamRequestDto = z.infer<typeof CreateExamRequestSchema>;

export const SubmitAnswerItemSchema = z.object({
  questionId: z.string(),
  studentAnswer: z.string(),
});
export type SubmitAnswerItemDto = z.infer<typeof SubmitAnswerItemSchema>;

export const SubmitAttemptSchema = z.object({
  idempotencyKey: z.string().min(1),
  answers: z.array(SubmitAnswerItemSchema),
});
export type SubmitAttemptDto = z.infer<typeof SubmitAttemptSchema>;

// ==========================================
// TUTOR & VOICE DTOs
// ==========================================
export const CreateTutorSessionSchema = z.object({
  topicId: z.string().uuid().optional(),
  documentId: z.string().uuid().optional(),
  language: z.enum(['si', 'ta', 'en']).default('en'),
});
export type CreateTutorSessionDto = z.infer<typeof CreateTutorSessionSchema>;

export const SendTutorMessageSchema = z.object({
  content: z.string().min(1),
});
export type SendTutorMessageDto = z.infer<typeof SendTutorMessageSchema>;

export const CreateVoiceSessionSchema = z.object({
  topicId: z.string().uuid().optional(),
  language: z.enum(['si', 'ta', 'en']).default('en'),
});
export type CreateVoiceSessionDto = z.infer<typeof CreateVoiceSessionSchema>;
