import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { PrismaService } from './prisma.service.js';
import { CryptoUtil } from './crypto.util.js';
import { AppException } from '@studypal/service-kit';
import {
  RegisterRequestDto,
  LoginRequestDto,
  AuthResponseDto,
} from '@studypal/contracts';
import { UserRole } from '@studypal/types';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpirySeconds: number;
  private readonly refreshExpirySeconds: number;

  constructor(private readonly prisma: PrismaService) {
    this.accessSecret =
      process.env.JWT_ACCESS_SECRET ||
      'studypal_dev_access_token_secret_which_is_very_secure_32bytes';
    this.refreshSecret =
      process.env.JWT_REFRESH_SECRET ||
      'studypal_dev_refresh_token_secret_which_is_very_secure_32bytes';
    this.accessExpirySeconds = Number(process.env.JWT_ACCESS_EXPIRATION_SECONDS) || 900;
    this.refreshExpirySeconds = Number(process.env.JWT_REFRESH_EXPIRATION_SECONDS) || 604800;
  }

  private generateTokens(userId: string, email: string, role: UserRole, studentProfileId?: string) {
    const accessToken = jwt.sign(
      { sub: userId, email, role, studentProfileId },
      this.accessSecret,
      { expiresIn: this.accessExpirySeconds },
    );

    const rawRefreshToken = CryptoUtil.generateSecureToken(48);
    const refreshTokenHash = CryptoUtil.hashToken(rawRefreshToken);

    return {
      accessToken,
      rawRefreshToken,
      refreshTokenHash,
    };
  }

  async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw AppException.conflict('An account with this email address already exists');
    }

    const passwordHash = await CryptoUtil.hashPassword(dto.password);
    const familyId = crypto.randomUUID();

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          role: dto.role as any,
          consentGiven: dto.parentConsentGiven,
          profile: {
            create: {
              displayName: dto.displayName,
              grade: dto.grade,
              language: dto.language,
            },
          },
        },
        include: { profile: true },
      });

      return newUser;
    });

    const tokens = this.generateTokens(
      user.id,
      user.email,
      user.role as UserRole,
      user.profile?.id,
    );

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: tokens.refreshTokenHash,
        familyId,
        expiresAt: new Date(Date.now() + this.refreshExpirySeconds * 1000),
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName || user.email,
        role: user.role as UserRole,
        language: (user.profile?.language as any) || 'en',
        grade: user.profile?.grade,
      },
    };
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      throw AppException.unauthorized('Invalid email or password');
    }

    const validPassword = await CryptoUtil.verifyPassword(dto.password, user.passwordHash);
    if (!validPassword) {
      throw AppException.unauthorized('Invalid email or password');
    }

    const familyId = crypto.randomUUID();
    const tokens = this.generateTokens(
      user.id,
      user.email,
      user.role as UserRole,
      user.profile?.id,
    );

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: tokens.refreshTokenHash,
        familyId,
        expiresAt: new Date(Date.now() + this.refreshExpirySeconds * 1000),
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.profile?.displayName || user.email,
        role: user.role as UserRole,
        language: (user.profile?.language as any) || 'en',
        grade: user.profile?.grade,
      },
    };
  }

  async refreshToken(rawRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = CryptoUtil.hashToken(rawRefreshToken);

    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { profile: true } } },
    });

    if (!tokenRecord) {
      throw AppException.unauthorized('Invalid refresh token');
    }

    // Check expiration
    if (new Date() > tokenRecord.expiresAt) {
      throw AppException.unauthorized('Refresh token has expired');
    }

    // REUSE DETECTION: If token was already revoked, someone is replaying a stolen token!
    if (tokenRecord.isRevoked) {
      console.warn(
        `[SECURITY ALERT: REUSE DETECTED] Token reuse detected for user ${tokenRecord.userId} in family ${tokenRecord.familyId}! Invalidating entire family.`,
      );
      // Invalidate all tokens in the family
      await this.prisma.refreshToken.updateMany({
        where: { familyId: tokenRecord.familyId },
        data: { isRevoked: true },
      });

      throw new AppException(
        'TOKEN_REUSED',
        'Security breach detected: refresh token reuse. Please log in again.',
        401,
      );
    }

    // Normal rotation: revoke current token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true },
    });

    // Issue new access + refresh pair in same family
    const tokens = this.generateTokens(
      tokenRecord.user.id,
      tokenRecord.user.email,
      tokenRecord.user.role as UserRole,
      tokenRecord.user.profile?.id,
    );

    await this.prisma.refreshToken.create({
      data: {
        userId: tokenRecord.user.id,
        tokenHash: tokens.refreshTokenHash,
        familyId: tokenRecord.familyId,
        expiresAt: new Date(Date.now() + this.refreshExpirySeconds * 1000),
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.rawRefreshToken,
    };
  }

  async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) return;
    const tokenHash = CryptoUtil.hashToken(rawRefreshToken);
    const record = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (record) {
      await this.prisma.refreshToken.updateMany({
        where: { familyId: record.familyId },
        data: { isRevoked: true },
      });
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw AppException.notFound('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.profile?.displayName,
      grade: user.profile?.grade,
      language: user.profile?.language,
    };
  }

  getPublicKeys() {
    return {
      algorithms: ['HS256'],
      issuer: 'studypal-identity-service',
      jwks: [
        {
          kty: 'oct',
          use: 'sig',
          alg: 'HS256',
          kid: 'studypal-default-key',
        },
      ],
    };
  }
}
