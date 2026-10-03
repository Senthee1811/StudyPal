import { DomainEvent } from '@studypal/contracts';
import { IEventBus } from './event-bus.interface.js';

export interface OutboxRecord {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: any;
  published: boolean;
  createdAt: Date;
  publishedAt?: Date | null;
}

export interface IOutboxRepository {
  fetchUnpublished(limit: number): Promise<OutboxRecord[]>;
  markAsPublished(id: string): Promise<void>;
}

export class OutboxRelayService {
  private isRelaying = false;

  constructor(
    private readonly repository: IOutboxRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async processPendingEvents(batchSize = 20): Promise<number> {
    if (this.isRelaying) return 0;
    this.isRelaying = true;
    let processedCount = 0;

    try {
      const pendingRecords = await this.repository.fetchUnpublished(batchSize);

      for (const record of pendingRecords) {
        const domainEvent: DomainEvent = {
          eventId: record.id,
          eventType: record.eventType as any,
          aggregateId: record.aggregateId,
          aggregateType: record.aggregateType as any,
          timestamp: record.createdAt.toISOString(),
          version: 1,
          payload: typeof record.payload === 'string' ? JSON.parse(record.payload) : record.payload,
        } as any;

        await this.eventBus.publish(domainEvent);
        await this.repository.markAsPublished(record.id);
        processedCount++;
      }
    } catch (err) {
      console.error('[OutboxRelayService] Error processing outbox events:', err);
    } finally {
      this.isRelaying = false;
    }

    return processedCount;
  }
}
