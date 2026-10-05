import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

export interface LogUsageOptions {
  traceId: string;
  userId: string;
  task: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  status: 'SUCCESS' | 'FALLBACK' | 'ERROR';
  errorMessage?: string;
  promptText?: string;
  responseText?: string;
}

@Injectable()
export class MeteringService {
  private readonly logger = new Logger(MeteringService.name);

  constructor(private readonly prisma: PrismaService) {}

  public redactPii(text: string): string {
    if (!text) return '';
    return text
      // Redact Sri Lankan NIC (9 digits + V/X or 12 digits)
      .replace(/\b([0-9]{9}[vVxX]|[0-9]{12})\b/g, '[REDACTED_NIC]')
      // Redact Sri Lankan phone numbers (+94... or 07...)
      .replace(/\b(\+94|0)?[7][0-9]{8}\b/g, '[REDACTED_PHONE]')
      // Redact emails
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]');
  }

  public calculateCost(provider: string, model: string, promptTokens: number, completionTokens: number): number {
    let promptRatePerK = 0.0001;
    let completionRatePerK = 0.0002;

    if (provider === 'OPENAI') {
      if (model.includes('gpt-4o-mini')) {
        promptRatePerK = 0.00015;
        completionRatePerK = 0.0006;
      } else {
        promptRatePerK = 0.0025;
        completionRatePerK = 0.01;
      }
    } else if (provider === 'GEMINI') {
      promptRatePerK = 0.000075;
      completionRatePerK = 0.0003;
    } else {
      // MOCK or OLLAMA cost is zero
      return 0.0;
    }

    const cost = (promptTokens / 1000) * promptRatePerK + (completionTokens / 1000) * completionRatePerK;
    return parseFloat(cost.toFixed(6));
  }

  async logUsage(opts: LogUsageOptions): Promise<void> {
    const totalTokens = opts.promptTokens + opts.completionTokens;
    const costUsd = this.calculateCost(opts.provider, opts.model, opts.promptTokens, opts.completionTokens);

    try {
      await this.prisma.aiUsageLog.create({
        data: {
          traceId: opts.traceId,
          userId: opts.userId,
          task: opts.task,
          provider: opts.provider,
          model: opts.model,
          promptTokens: opts.promptTokens,
          completionTokens: opts.completionTokens,
          totalTokens,
          costUsd,
          latencyMs: opts.latencyMs,
          status: opts.status,
          errorMessage: opts.errorMessage,
        },
      });

      // Update daily aggregated usage quota
      const today = new Date().toISOString().split('T')[0];
      await this.prisma.usageQuota.upsert({
        where: {
          userId_date: {
            userId: opts.userId,
            date: today,
          },
        },
        create: {
          userId: opts.userId,
          date: today,
          tokensUsed: totalTokens,
          requestCount: 1,
          costUsd,
        },
        update: {
          tokensUsed: { increment: totalTokens },
          requestCount: { increment: 1 },
          costUsd: { increment: costUsd },
        },
      });
    } catch (err: any) {
      this.logger.error(`Failed to record AI usage log: ${err.message}`);
    }
  }
}
