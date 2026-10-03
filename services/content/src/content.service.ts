import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { AppException } from '@studypal/service-kit';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurriculums() {
    return this.prisma.curriculumVersion.findMany({
      where: { isActive: true },
      include: {
        subjects: true,
      },
      orderBy: { year: 'desc' },
    });
  }

  async getTopics(subjectId?: string, language = 'en', grade?: number) {
    const where: any = {};
    if (subjectId) where.subjectId = subjectId;
    if (language) where.language = language;
    if (grade) where.subject = { grade };

    return this.prisma.topic.findMany({
      where,
      include: { subject: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async getTopicById(id: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
      include: { subject: true },
    });
    if (!topic) throw AppException.notFound('Topic not found');
    return topic;
  }

  async getOfficialQuestions(topicId?: string, language = 'en', limit = 20) {
    const where: any = { status: 'APPROVED' };
    if (topicId) where.topicId = topicId;
    if (language) where.language = language;

    return this.prisma.question.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async reviewQuestion(
    id: string,
    reviewerId: string,
    status: 'APPROVED' | 'REJECTED' | 'IN_REVIEW',
    reviewNotes?: string,
  ) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw AppException.notFound('Question not found');

    const updated = await this.prisma.question.update({
      where: { id },
      data: {
        status: status as any,
        reviewerId,
        reviewNotes,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        entityType: 'QUESTION',
        entityId: id,
        action: `QUESTION_${status}`,
        performedBy: reviewerId,
        metadata: { reviewNotes },
      },
    });

    return updated;
  }

  async getGeographyFeatures() {
    return this.prisma.mapFeature.findMany({
      orderBy: { nameEn: 'asc' },
    });
  }

  async getGeographyQuestions(language = 'en') {
    const questions = await this.prisma.mapQuestion.findMany({
      include: { mapFeature: true },
    });

    return questions.map((q) => ({
      id: q.id,
      prompt: language === 'si' ? q.promptSi : language === 'ta' ? q.promptTa : q.promptEn,
      marks: q.marks,
      toleranceKm: q.toleranceKm,
      featureCategory: q.mapFeature.category,
    }));
  }

  // Haversine formula to compute great-circle distance between two GPS coordinates
  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async evaluateGeographyAttempt(questionId: string, studentLat: number, studentLng: number) {
    const question = await this.prisma.mapQuestion.findUnique({
      where: { id: questionId },
      include: { mapFeature: true },
    });

    if (!question) throw AppException.notFound('Map question not found');

    const distanceKm = this.calculateDistanceKm(
      studentLat,
      studentLng,
      question.mapFeature.latitude,
      question.mapFeature.longitude,
    );

    const isCorrect = distanceKm <= question.toleranceKm;
    const marksObtained = isCorrect ? question.marks : 0;

    return {
      questionId,
      isCorrect,
      marksObtained,
      maxMarks: question.marks,
      distanceKm: Math.round(distanceKm * 10) / 10,
      toleranceKm: question.toleranceKm,
      actualLocation: {
        name: question.mapFeature.nameEn,
        latitude: question.mapFeature.latitude,
        longitude: question.mapFeature.longitude,
      },
    };
  }
}
