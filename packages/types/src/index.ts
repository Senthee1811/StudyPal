export type UserRole = 'STUDENT' | 'TEACHER' | 'CONTENT_REVIEWER' | 'ADMIN';

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  CONTENT_REVIEWER: 'CONTENT_REVIEWER',
  ADMIN: 'ADMIN',
} as const;

export type SupportedLanguage = 'si' | 'ta' | 'en';

export const SUPPORTED_LANGUAGES = {
  SI: 'si',
  TA: 'ta',
  EN: 'en',
} as const;

export type DocumentStatus = 'PENDING' | 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';

export const DOCUMENT_STATUSES = {
  PENDING: 'PENDING',
  UPLOADED: 'UPLOADED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  FAILED: 'FAILED',
} as const;

export type QuestionType = 'MCQ' | 'SHORT_ANSWER' | 'STRUCTURED';

export const QUESTION_TYPES = {
  MCQ: 'MCQ',
  SHORT_ANSWER: 'SHORT_ANSWER',
  STRUCTURED: 'STRUCTURED',
} as const;

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export const DIFFICULTIES = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';

export const ATTEMPT_STATUSES = {
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  EVALUATED: 'EVALUATED',
} as const;

export interface InternalAuthContext {
  userId: string;
  email: string;
  role: UserRole;
  studentProfileId?: string;
  correlationId: string;
  timestamp: number;
}

export interface AuthenticatedUserPayload {
  sub: string;
  email: string;
  role: UserRole;
  studentProfileId?: string;
  iat?: number;
  exp?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiStandardResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    correlationId?: string;
  };
  meta?: {
    timestamp: string;
    correlationId: string;
  };
}

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'VALIDATION_FAILED'
  | 'CONFLICT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'CIRCUIT_BREAKER_OPEN'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_REUSED'
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'QUOTA_EXCEEDED'
  | 'DOCUMENT_NOT_READY'
  | 'IDEMPOTENCY_CONFLICT';
