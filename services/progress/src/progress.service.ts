import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { IEventBus, RedisStreamsEventBus, MemoryEventBus } from '@studypal/messaging';
import { AttemptSubmittedEvent } from '@studypal/contracts';
import { MasteryCalculator } from './mastery-calculator.js';

@Injectable()
export class ProgressService implements OnModuleInit, OnModuleDestroy {
  private eventBus: IEventBus;

  constructor(private readonly prisma: PrismaService) {
    if (process.env.NODE_ENV === 'test') {
      this.eventBus = new MemoryEventBus();
    } else {
      this.eventBus = new RedisStreamsEventBus({
        redisUrl: process.env.REDIS_URL,
      });
    }
  }

  async onModuleInit() {
    await this.startEventListener();
  }

  async onModuleDestroy() {
    await this.eventBus.close();
  }

  async startEventListener() {
    console.log('[ProgressService] Registering AttemptSubmitted event subscription...');

    await this.eventBus.subscribe<AttemptSubmittedEvent>(
      'AttemptSubmitted',
      'progress-consumer-group',
      async (event) => {
        await this.handleAttemptSubmitted(event);
      },
    );
  }

  async handleAttemptSubmitted(event: AttemptSubmittedEvent) {
    const { userId, attemptId, answers } = event.payload;
    console.log(`[ProgressService] Processing attempt ${attemptId} for user ${userId}`);

    // Group answers by topicId to update mastery
    const topicMap = new Map<string, { total: number; correct: number }>();

    for (const ans of answers) {
      // 1. Record evidence in answer_evidence table
      await this.prisma.answerEvidence.create({
        data: {
          userId,
          attemptId,
          questionId: ans.questionId,
          topicId: ans.topicId,
          isCorrect: ans.isCorrect,
          marksObtained: ans.marksObtained,
          maxMarks: ans.maxMarks,
        },
      });

      const current = topicMap.get(ans.topicId) || { total: 0, correct: 0 };
      current.total++;
      if (ans.isCorrect) current.correct++;
      topicMap.set(ans.topicId, current);
    }

    // 2. Recalculate topic mastery for affected topics
    for (const [topicId, stats] of topicMap.entries()) {
      const existing = await this.prisma.topicMastery.findUnique({
        where: { userId_topicId: { userId, topicId } },
      });

      const newEvidenceCount = (existing?.evidenceCount || 0) + stats.total;
      const newCorrectCount = (existing?.correctCount || 0) + stats.correct;

      const computed = MasteryCalculator.compute({
        evidenceCount: newEvidenceCount,
        correctCount: newCorrectCount,
      });

      await this.prisma.topicMastery.upsert({
        where: { userId_topicId: { userId, topicId } },
        create: {
          userId,
          topicId,
          evidenceCount: computed.evidenceCount,
          correctCount: computed.correctCount,
          masteryScore: computed.masteryScore,
          confidence: computed.confidence,
        },
        update: {
          evidenceCount: computed.evidenceCount,
          correctCount: computed.correctCount,
          masteryScore: computed.masteryScore,
          confidence: computed.confidence,
        },
      });

      // Update recommendation
      await this.prisma.recommendation.deleteMany({
        where: { userId, topicId },
      });

      await this.prisma.recommendation.create({
        data: {
          userId,
          topicId,
          priority: computed.recommendation.priority,
          reason: computed.recommendation.reason,
          actionTitle: computed.recommendation.actionTitle,
        },
      });
    }

    console.log(`[ProgressService] Updated mastery across ${topicMap.size} topics for user ${userId}`);
  }

  async getProgress(userId: string) {
    const masteryList = await this.prisma.topicMastery.findMany({
      where: { userId },
      orderBy: { masteryScore: 'asc' },
    });

    const totalQuestions = masteryList.reduce((sum: number, m: any) => sum + m.evidenceCount, 0);
    const overallMastery =
      masteryList.length > 0
        ? Math.round((masteryList.reduce((sum: number, m: any) => sum + m.masteryScore, 0) / masteryList.length) * 10) / 10
        : 0;

    return {
      userId,
      overallMastery,
      totalQuestionsAnswered: totalQuestions,
      topicsTracked: masteryList.length,
      topicBreakdown: masteryList,
    };
  }

  async getRecommendations(userId: string) {
    return this.prisma.recommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}
