import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { Retriever } from './rag/retriever.js';

// In-memory mock database enforcing parameterized WHERE filters
class MockKnowledgePrisma {
  public chunks: any[] = [];

  public documentChunk = {
    findMany: async ({ where }: any) => {
      return this.chunks.filter((c) => {
        // Document ID filter
        if (where.documentId && c.documentId !== where.documentId) return false;

        // User ownership or public visibility filter (OR: [{ userId }, { isPublic: true }])
        if (where.OR) {
          const matchUser = where.OR.some((cond: any) => cond.userId && cond.userId === c.userId);
          const matchPublic = where.OR.some((cond: any) => cond.isPublic === true && c.isPublic === true);
          return matchUser || matchPublic;
        }

        return true;
      });
    },
    create: async ({ data }: any) => {
      const chunk = { id: 'chunk-' + Math.random().toString(36).substring(7), ...data };
      this.chunks.push(chunk);
      return chunk;
    },
  };
}

describe('KnowledgeService: Cross-User Document Isolation', () => {
  let mockPrisma: MockKnowledgePrisma;
  let retriever: Retriever;

  const studentAId = 'student-alice-uuid-0001';
  const studentBId = 'student-bob-uuid-0002';
  const docAId = 'private-notes-alice-doc-1';
  const publicCurriculumDocId = 'official-grade9-maths-doc-2';

  beforeEach(() => {
    mockPrisma = new MockKnowledgePrisma();
    retriever = new Retriever(mockPrisma as any);

    // Populate Alice's private study notes
    mockPrisma.chunks.push({
      id: 'c1',
      documentId: docAId,
      userId: studentAId,
      pageNumber: 1,
      chunkIndex: 0,
      content: 'Alice private study notes on Quadratic Equations and personal exam tips.',
      isPublic: false,
    });

    // Populate official public curriculum chunks
    mockPrisma.chunks.push({
      id: 'c2',
      documentId: publicCurriculumDocId,
      userId: 'admin-curriculum-uuid',
      pageNumber: 1,
      chunkIndex: 0,
      content: 'Official NIE Sri Lanka Mathematics Grade 9 Textbook Theorem 1.',
      isPublic: true,
    });
  });

  it('Alice should be able to retrieve her own private document chunks', async () => {
    const results = await retriever.retrieveHybrid(docAId, studentAId, ['Quadratic', 'Equations']);
    assert.strictEqual(results.length, 1, 'Alice must be able to retrieve her own chunks');
    assert.ok(results[0]?.content.includes('Alice private study notes'));
  });

  it('Bob must NOT be able to retrieve Alice private document chunks (Strict Isolation)', async () => {
    const results = await retriever.retrieveHybrid(docAId, studentBId, ['Quadratic', 'Equations']);
    assert.strictEqual(results.length, 0, 'Bob must NOT receive any chunks from Alice private document');
  });

  it('Both Alice and Bob can retrieve public official curriculum chunks', async () => {
    const aliceRes = await retriever.retrieveHybrid(publicCurriculumDocId, studentAId, ['Mathematics']);
    const bobRes = await retriever.retrieveHybrid(publicCurriculumDocId, studentBId, ['Mathematics']);

    assert.strictEqual(aliceRes.length, 1, 'Alice can view public content');
    assert.strictEqual(bobRes.length, 1, 'Bob can view public content');
  });
});
