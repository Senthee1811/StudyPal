import { z } from 'zod';

export const BaseEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string(),
  aggregateId: z.string(),
  aggregateType: z.string(),
  timestamp: z.string().datetime(),
  version: z.number().int().default(1),
  correlationId: z.string().uuid().optional(),
});

export const DocumentUploadedEventPayloadSchema = z.object({
  documentId: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  fileUrl: z.string(),
  fileSize: z.number().int().positive(),
  mimeType: z.literal('application/pdf'),
  language: z.enum(['si', 'ta', 'en']).default('en'),
  subjectId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
});

export const DocumentUploadedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('DocumentUploaded'),
  aggregateType: z.literal('Document'),
  payload: DocumentUploadedEventPayloadSchema,
});

export type DocumentUploadedEvent = z.infer<typeof DocumentUploadedEventSchema>;

export const DocumentReadyEventPayloadSchema = z.object({
  documentId: z.string().uuid(),
  userId: z.string().uuid(),
  totalChunks: z.number().int().nonnegative(),
  pageCount: z.number().int().positive(),
  summary: z.string(),
});

export const DocumentReadyEventSchema = BaseEventSchema.extend({
  eventType: z.literal('DocumentReady'),
  aggregateType: z.literal('Document'),
  payload: DocumentReadyEventPayloadSchema,
});

export type DocumentReadyEvent = z.infer<typeof DocumentReadyEventSchema>;

export const DocumentFailedEventPayloadSchema = z.object({
  documentId: z.string().uuid(),
  userId: z.string().uuid(),
  reason: z.string(),
  retryable: z.boolean().default(false),
});

export const DocumentFailedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('DocumentFailed'),
  aggregateType: z.literal('Document'),
  payload: DocumentFailedEventPayloadSchema,
});

export type DocumentFailedEvent = z.infer<typeof DocumentFailedEventSchema>;

export const DocumentDeletedEventPayloadSchema = z.object({
  documentId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const DocumentDeletedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('DocumentDeleted'),
  aggregateType: z.literal('Document'),
  payload: DocumentDeletedEventPayloadSchema,
});

export type DocumentDeletedEvent = z.infer<typeof DocumentDeletedEventSchema>;

export const AttemptSubmittedEventPayloadSchema = z.object({
  attemptId: z.string().uuid(),
  userId: z.string().uuid(),
  examId: z.string().uuid().optional(),
  quizId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  totalMarks: z.number().nonnegative(),
  score: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),
  answers: z.array(
    z.object({
      questionId: z.string(),
      topicId: z.string().uuid(),
      isCorrect: z.boolean(),
      marksObtained: z.number(),
      maxMarks: z.number(),
      studentAnswer: z.string(),
      feedback: z.string().optional(),
    }),
  ),
});

export const AttemptSubmittedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('AttemptSubmitted'),
  aggregateType: z.literal('ExamAttempt'),
  payload: AttemptSubmittedEventPayloadSchema,
});

export type AttemptSubmittedEvent = z.infer<typeof AttemptSubmittedEventSchema>;

export const AnswerMarkedEventPayloadSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string(),
  studentId: z.string().uuid(),
  topicId: z.string().uuid(),
  isCorrect: z.boolean(),
  marksObtained: z.number(),
  maxMarks: z.number(),
});

export const AnswerMarkedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('AnswerMarked'),
  aggregateType: z.literal('StudentAnswer'),
  payload: AnswerMarkedEventPayloadSchema,
});

export type AnswerMarkedEvent = z.infer<typeof AnswerMarkedEventSchema>;

export const UserDeletedEventPayloadSchema = z.object({
  userId: z.string().uuid(),
});

export const UserDeletedEventSchema = BaseEventSchema.extend({
  eventType: z.literal('UserDeleted'),
  aggregateType: z.literal('User'),
  payload: UserDeletedEventPayloadSchema,
});

export type UserDeletedEvent = z.infer<typeof UserDeletedEventSchema>;

export type DomainEvent =
  | DocumentUploadedEvent
  | DocumentReadyEvent
  | DocumentFailedEvent
  | DocumentDeletedEvent
  | AttemptSubmittedEvent
  | AnswerMarkedEvent
  | UserDeletedEvent;
