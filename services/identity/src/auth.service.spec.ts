import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { AuthService } from './auth.service.js';
import { CryptoUtil } from './crypto.util.js';

// In-memory mock Prisma for testing token rotation and reuse detection
class MockPrismaService {
  public users = new Map<string, any>();
  public refreshTokens = new Map<string, any>();

  public user = {
    findUnique: async ({ where }: any) => {
      if (where.email) {
        for (const u of this.users.values()) {
          if (u.email === where.email) return u;
        }
      }
      if (where.id) return this.users.get(where.id);
      return null;
    },
    create: async ({ data }: any) => {
      const id = 'user-uuid-' + Math.random().toString(36).substring(7);
      const user = {
        id,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        consentGiven: data.consentGiven,
        profile: {
          id: 'profile-' + id,
          displayName: data.profile?.create?.displayName || 'Student',
          grade: data.profile?.create?.grade,
          language: data.profile?.create?.language || 'en',
        },
      };
      this.users.set(id, user);
      return user;
    },
  };

  public refreshToken = {
    findUnique: async ({ where }: any) => {
      if (where.tokenHash) {
        const record = this.refreshTokens.get(where.tokenHash);
        if (record) {
          const user = this.users.get(record.userId);
          return { ...record, user };
        }
      }
      return null;
    },
    create: async ({ data }: any) => {
      const id = 'rt-' + Math.random().toString(36).substring(7);
      const record = { id, ...data, isRevoked: false };
      this.refreshTokens.set(data.tokenHash, record);
      return record;
    },
    update: async ({ where, data }: any) => {
      for (const [hash, r] of this.refreshTokens.entries()) {
        if (r.id === where.id) {
          const updated = { ...r, ...data };
          this.refreshTokens.set(hash, updated);
          return updated;
        }
      }
    },
    updateMany: async ({ where, data }: any) => {
      for (const [hash, r] of this.refreshTokens.entries()) {
        if (r.familyId === where.familyId) {
          this.refreshTokens.set(hash, { ...r, ...data });
        }
      }
    },
  };

  public async $transaction(fn: any) {
    return fn(this);
  }
}

describe('AuthService: Token Rotation and Reuse Detection', () => {
  let authService: AuthService;
  let mockPrisma: MockPrismaService;

  beforeEach(() => {
    mockPrisma = new MockPrismaService();
    authService = new AuthService(mockPrisma as any);
  });

  it('should register a new student and return token pair', async () => {
    const res = await authService.register({
      email: 'student@example.com',
      password: 'SecurePassword123!',
      displayName: 'Kasun Perera',
      grade: 9,
      language: 'si',
      role: 'STUDENT',
      parentConsentGiven: true,
    });

    assert.ok(res.accessToken, 'Access token should be returned');
    assert.ok(res.refreshToken, 'Refresh token should be returned');
    assert.strictEqual(res.user.email, 'student@example.com');
  });

  it('should successfully rotate refresh token on valid refresh request', async () => {
    const auth = await authService.register({
      email: 'student2@example.com',
      password: 'SecurePassword123!',
      displayName: 'Nimali Silva',
      grade: 9,
      language: 'en',
      role: 'STUDENT',
      parentConsentGiven: true,
    });

    const initialRefreshToken = auth.refreshToken;
    const rotated = await authService.refreshToken(initialRefreshToken);

    assert.ok(rotated.accessToken);
    assert.ok(rotated.refreshToken);
    assert.notStrictEqual(rotated.refreshToken, initialRefreshToken, 'New refresh token must be issued');

    // The old refresh token should now be revoked in the store
    const oldHash = CryptoUtil.hashToken(initialRefreshToken);
    const oldRecord = mockPrisma.refreshTokens.get(oldHash);
    assert.strictEqual(oldRecord.isRevoked, true, 'Old refresh token must be marked as revoked');
  });

  it('should detect REUSE when an already-revoked refresh token is replayed and revoke the family', async () => {
    const auth = await authService.register({
      email: 'student3@example.com',
      password: 'SecurePassword123!',
      displayName: 'Fathima Rizwan',
      grade: 10,
      language: 'ta',
      role: 'STUDENT',
      parentConsentGiven: true,
    });

    const token1 = auth.refreshToken;

    // First rotation (valid)
    const rotation1 = await authService.refreshToken(token1);
    const token2 = rotation1.refreshToken;

    // Attacker tries to replay token1 which was already used and revoked!
    let errorCaught: any = null;
    try {
      await authService.refreshToken(token1);
    } catch (err) {
      errorCaught = err;
    }

    assert.ok(errorCaught, 'Replaying revoked token must throw an error');
    assert.strictEqual(errorCaught.code, 'TOKEN_REUSED', 'Must fail with TOKEN_REUSED error code');

    // Verify that token2 (the legitimate active token in the same family) is now also invalidated!
    const token2Hash = CryptoUtil.hashToken(token2);
    const token2Record = mockPrisma.refreshTokens.get(token2Hash);
    assert.strictEqual(token2Record.isRevoked, true, 'Token reuse must revoke all tokens in the family');
  });
});
