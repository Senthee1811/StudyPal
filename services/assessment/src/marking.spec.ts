process.env.NODE_ENV = 'test';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { AssessmentService } from './assessment.service.js';

class MockAssessmentPrisma {
  public attempts = new Map<string, any>();
  public exams = new Map<string, any>();
  public outboxRecords: any[] = [];

  public exam = {
    findUnique: async ({ where }: any) => this.exams.get(where.id),
  };

  public examAttempt = {
    findUnique: async ({ where }: any) => {
      if (where.id) return this.attempts.get(where.id);
      if (where.idempotencyKey) {
        for (const a of this.attempts.values()) {
          if (a.idempotencyKey === where.idempotencyKey) return a;
        }
      }
      return null;
    },
    update: async ({ where, data }: any) => {
      const attempt = this.attempts.get(where.id);
      const updated = { ...attempt, ...data };
      this.attempts.set(where.id, updated);
      return updated;
    },
  };

  public outbox = {
    create: async ({ data }: any) => {
      const record = { id: 'outbox-' + Math.random(), createdAt: new Date(), ...data };
      this.outboxRecords.push(record);
      return record;
    },
    findMany: async ({ where }: any) => {
      return this.outboxRecords.filter((r) => !r.published);
    },
    update: async ({ where, data }: any) => {
      const rec = this.outboxRecords.find((r) => r.id === where.id);
      if (rec) Object.assign(rec, data);
      return rec;
    },
  };

  public async $transaction(actions: any[]) {
    return Promise.all(actions);
  }
}

describe('AssessmentService: Exam Marking and Outbox Idempotency', () => {
  let mockPrisma: MockAssessmentPrisma;
  let service: AssessmentService;

  const testUserId = 'student-test-uuid-001';
  const testExamId = 'exam-grade9-maths-001';
  const testAttemptId = 'attempt-001';

  beforeEach(() => {
    mockPrisma = new MockAssessmentPrisma();
    service = new AssessmentService(mockPrisma as any);

    // Setup an official exam with immutable question snapshot
    const examSnapshot = {
      id: testExamId,
      title: 'Grade 9 Mathematics Model Paper',
      totalMarks: 5.0,
      questions: [
        {
          id: 'q1',
          type: 'MCQ',
          prompt: 'What is 7 × 8?',
          correctAnswer: '56',
          explanation: '7 times 8 equals 56.',
          marks: 2.0,
          topicId: 'topic-algebra-01',
        },
        {
          id: 'q2',
          type: 'MCQ',
          prompt: 'What is the square root of 81?',
          correctAnswer: '9',
          explanation: '9 × 9 = 81.',
          marks: 3.0,
          topicId: 'topic-indices-02',
        },
      ],
    };
    mockPrisma.exams.set(testExamId, examSnapshot);

    // Setup in-progress attempt
    mockPrisma.attempts.set(testAttemptId, {
      id: testAttemptId,
      examId: testExamId,
      userId: testUserId,
      status: 'IN_PROGRESS',
      totalMarks: 5.0,
      exam: examSnapshot,
    });
  });

  it('should accurately mark objective student answers against immutable question snapshot', async () => {
    const authUser = {
      userId: testUserId,
      email: 'student@example.com',
      role: 'STUDENT' as const,
      correlationId: 'cid-001',
      timestamp: Date.now(),
    };

    const submission = {
      idempotencyKey: 'idem-attempt-submission-key-1',
      answers: [
        { questionId: 'q1', studentAnswer: '56' }, // Correct (2 marks)
        { questionId: 'q2', studentAnswer: '10' }, // Incorrect (0 marks)
      ],
    };

    const result = await service.submitAndMarkAttempt(authUser, testAttemptId, submission);

    assert.strictEqual(result.attempt.status, 'EVALUATED');
    assert.strictEqual(result.attempt.score, 2.0, 'Score should be 2.0 for 1 correct answer');
    assert.strictEqual(result.attempt.totalMarks, 5.0);
    assert.strictEqual(result.attempt.percentage, 40.0, 'Percentage should be 40%');
    assert.strictEqual(mockPrisma.outboxRecords.length, 1, 'Transactional outbox must contain 1 event');
    assert.strictEqual(mockPrisma.outboxRecords[0].eventType, 'AttemptSubmitted');
  });

  it('should be idempotent and reject duplicate evaluation when same idempotencyKey is submitted', async () => {
    const authUser = {
      userId: testUserId,
      email: 'student@example.com',
      role: 'STUDENT' as const,
      correlationId: 'cid-002',
      timestamp: Date.now(),
    };

    const submission = {
      idempotencyKey: 'idem-unique-key-xyz',
      answers: [
        { questionId: 'q1', studentAnswer: '56' },
        { questionId: 'q2', studentAnswer: '9' },
      ],
    };

    // First submission
    const res1 = await service.submitAndMarkAttempt(authUser, testAttemptId, submission);
    assert.strictEqual(res1.isDuplicateSubmission, false);
    assert.strictEqual(res1.attempt.score, 5.0);

    // Second submission with exact same idempotencyKey (network retry)
    const res2 = await service.submitAndMarkAttempt(authUser, testAttemptId, submission);
    assert.strictEqual(res2.isDuplicateSubmission, true, 'Must detect duplicate submission via idempotency key');
    assert.strictEqual(res2.attempt.score, 5.0, 'Must return existing score without duplicate marking');
    assert.strictEqual(mockPrisma.outboxRecords.length, 1, 'Must NOT create duplicate outbox records');
  });
});
