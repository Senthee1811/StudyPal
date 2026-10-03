import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import crypto from 'node:crypto';
import { PrismaService } from './prisma.service.js';
import { StorageService } from './storage.service.js';
import { AppException } from '@studypal/service-kit';
import { IEventBus, RedisStreamsEventBus, MemoryEventBus, OutboxRelayService } from '@studypal/messaging';
import { CreateUploadIntentDto, DocumentUploadedEvent } from '@studypal/contracts';
import { InternalAuthContext } from '@studypal/types';

@Injectable()
export class DocumentService implements OnModuleInit, OnModuleDestroy {
  private eventBus: IEventBus;
  private outboxRelay: OutboxRelayService;
  private pollInterval?: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {
    if (process.env.NODE_ENV === 'test') {
      this.eventBus = new MemoryEventBus();
    } else {
      this.eventBus = new RedisStreamsEventBus({
        redisUrl: process.env.REDIS_URL,
      });
    }

    const outboxRepo = {
      fetchUnpublished: async (limit: number) => {
        const records = await this.prisma.outbox.findMany({
          where: { published: false },
          take: limit,
          orderBy: { createdAt: 'asc' },
        });
        return records.map((r) => ({
          ...r,
          publishedAt: r.publishedAt || null,
        }));
      },
      markAsPublished: async (id: string) => {
        await this.prisma.outbox.update({
          where: { id },
          data: { published: true, publishedAt: new Date() },
        });
      },
    };

    this.outboxRelay = new OutboxRelayService(outboxRepo, this.eventBus);
  }

  async onModuleInit() {
    // Relay outbox events every 2 seconds
    this.pollInterval = setInterval(async () => {
      try {
        await this.outboxRelay.processPendingEvents(20);
      } catch (_) {}
    }, 2000);
  }

  async onModuleDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    await this.eventBus.close();
  }

  async createUploadIntent(user: InternalAuthContext, dto: CreateUploadIntentDto) {
    if (dto.fileSize > 50 * 1024 * 1024) {
      throw AppException.badRequest('File size exceeds maximum allowed limit of 50MB');
    }

    const documentId = crypto.randomUUID();
    const sanitizedFilename = dto.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `users/${user.userId}/documents/${documentId}/${sanitizedFilename}`;

    const presigned = await this.storage.getPresignedUploadUrl(storageKey, 'application/pdf');

    const document = await this.prisma.studyDocument.create({
      data: {
        id: documentId,
        userId: user.userId,
        title: dto.title,
        originalFilename: dto.filename,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        storageKey,
        status: 'PENDING',
        language: dto.language,
        subjectId: dto.subjectId,
        topicId: dto.topicId,
      },
    });

    return {
      documentId: document.id,
      uploadUrl: presigned.uploadUrl,
      expiresInSeconds: presigned.expiresIn,
      storageKey,
    };
  }

  async completeUpload(user: InternalAuthContext, documentId: string) {
    const document = await this.prisma.studyDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) throw AppException.notFound('Document not found');
    if (document.userId !== user.userId && user.role !== 'ADMIN') {
      throw AppException.forbidden('Access denied to this document');
    }

    // Validate magic bytes in storage
    await this.storage.validatePdfFile(document.storageKey);

    // Update document status and save event to outbox within a transaction
    const eventPayload = {
      documentId: document.id,
      userId: document.userId,
      title: document.title,
      fileUrl: document.storageKey,
      fileSize: document.fileSize,
      mimeType: 'application/pdf' as const,
      language: (document.language as any) || 'en',
      subjectId: document.subjectId || undefined,
      topicId: document.topicId || undefined,
    };

    const outboxEventId = crypto.randomUUID();

    const [updatedDoc] = await this.prisma.$transaction([
      this.prisma.studyDocument.update({
        where: { id: documentId },
        data: { status: 'UPLOADED' },
      }),
      this.prisma.outbox.create({
        data: {
          id: outboxEventId,
          aggregateType: 'Document',
          aggregateId: document.id,
          eventType: 'DocumentUploaded',
          payload: eventPayload,
          published: false,
        },
      }),
    ]);

    // Immediately trigger outbox relay
    this.outboxRelay.processPendingEvents(5).catch(() => {});

    return {
      documentId: updatedDoc.id,
      status: updatedDoc.status,
      message: 'Upload completed and queued for extraction and chunking',
    };
  }

  async listDocuments(user: InternalAuthContext) {
    return this.prisma.studyDocument.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocument(user: InternalAuthContext, documentId: string) {
    const document = await this.prisma.studyDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) throw AppException.notFound('Document not found');
    if (document.userId !== user.userId && user.role !== 'ADMIN') {
      throw AppException.forbidden('Access denied to this document');
    }

    return document;
  }

  async deleteDocument(user: InternalAuthContext, documentId: string) {
    const document = await this.prisma.studyDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) throw AppException.notFound('Document not found');
    if (document.userId !== user.userId && user.role !== 'ADMIN') {
      throw AppException.forbidden('Access denied to this document');
    }

    const eventPayload = {
      documentId: document.id,
      userId: document.userId,
    };

    await this.prisma.$transaction([
      this.prisma.studyDocument.delete({
        where: { id: documentId },
      }),
      this.prisma.outbox.create({
        data: {
          id: crypto.randomUUID(),
          aggregateType: 'Document',
          aggregateId: document.id,
          eventType: 'DocumentDeleted',
          payload: eventPayload,
          published: false,
        },
      }),
    ]);

    this.outboxRelay.processPendingEvents(5).catch(() => {});

    return { success: true, message: 'Document deleted and cascade deletion event dispatched' };
  }
}
