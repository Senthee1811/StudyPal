import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { AppException } from '@studypal/service-kit';

@Injectable()
export class QuotaService {
  private readonly dailyLimit: number;

  constructor(private readonly prisma: PrismaService) {
    this.dailyLimit = Number(process.env.AI_DAILY_TOKEN_QUOTA) || 100000;
  }

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0]!;
  }

  async checkAndIncrementQuota(userId: string, estimatedTokens: number) {
    const today = this.getTodayDateString();

    try {
      const quota = await this.prisma.usageQuota.upsert({
        where: { userId_date: { userId, date: today } },
        create: {
          userId,
          date: today,
          tokensUsed: estimatedTokens,
          requestCount: 1,
          costUsd: (estimatedTokens / 1000) * 0.0015,
        },
        update: {
          tokensUsed: { increment: estimatedTokens },
          requestCount: { increment: 1 },
          costUsd: { increment: (estimatedTokens / 1000) * 0.0015 },
        },
      });

      if (quota.tokensUsed > this.dailyLimit) {
        throw new AppException(
          'QUOTA_EXCEEDED',
          `Daily AI quota of ${this.dailyLimit} tokens exceeded for user. Resets at midnight UTC.`,
          429,
        );
      }

      return quota;
    } catch (err: any) {
      if (err instanceof AppException) throw err;
      // In offline / mock mode if DB is unavailable, allow request
      return { tokensUsed: estimatedTokens, limit: this.dailyLimit };
    }
  }

  async getQuotaStatus(userId: string) {
    const today = this.getTodayDateString();
    try {
      const quota = await this.prisma.usageQuota.findUnique({
        where: { userId_date: { userId, date: today } },
      });

      return {
        userId,
        date: today,
        tokensUsed: quota?.tokensUsed || 0,
        dailyLimit: this.dailyLimit,
        remainingTokens: Math.max(0, this.dailyLimit - (quota?.tokensUsed || 0)),
        requestCount: quota?.requestCount || 0,
      };
    } catch (_) {
      return {
        userId,
        date: today,
        tokensUsed: 0,
        dailyLimit: this.dailyLimit,
        remainingTokens: this.dailyLimit,
        requestCount: 0,
      };
    }
  }
}
