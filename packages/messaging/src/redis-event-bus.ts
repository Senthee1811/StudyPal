import { Redis } from 'ioredis';
import { DomainEvent } from '@studypal/contracts';
import { EventHandler, IEventBus } from './event-bus.interface.js';

export interface RedisEventBusOptions {
  redisUrl?: string;
  host?: string;
  port?: number;
  maxRetries?: number;
}

export class RedisStreamsEventBus implements IEventBus {
  private publisher: Redis;
  private subscriber: Redis;
  private isRunning = true;
  private subscriptions: { stream: string; group: string; consumer: string }[] = [];
  private maxRetries: number;

  constructor(options: RedisEventBusOptions = {}) {
    const url = options.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379';
    this.publisher = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 3 });
    this.subscriber = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 3 });
    this.maxRetries = options.maxRetries ?? 3;
  }

  private async ensureConnected() {
    if (this.publisher.status === 'wait') await this.publisher.connect();
    if (this.subscriber.status === 'wait') await this.subscriber.connect();
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    try {
      await this.ensureConnected();
      const streamKey = `studypal:events:${event.eventType}`;
      await this.publisher.xadd(streamKey, '*', 'payload', JSON.stringify(event));
    } catch (err) {
      console.error(`[RedisStreamsEventBus] Failed to publish ${event.eventType}:`, err);
      throw err;
    }
  }

  async subscribe<T extends DomainEvent>(
    eventType: string,
    consumerGroup: string,
    handler: EventHandler<T>,
  ): Promise<void> {
    await this.ensureConnected();
    const streamKey = `studypal:events:${eventType}`;
    const consumerName = `consumer-${process.pid}-${Math.random().toString(36).substring(7)}`;

    // Create group if it doesn't already exist
    try {
      await this.subscriber.xgroup('CREATE', streamKey, consumerGroup, '$', 'MKSTREAM');
    } catch (err: any) {
      if (!err.message?.includes('BUSYGROUP')) {
        console.warn(`[RedisStreamsEventBus] Warning creating group ${consumerGroup}:`, err.message);
      }
    }

    this.subscriptions.push({ stream: streamKey, group: consumerGroup, consumer: consumerName });

    // Poll in background
    this.startPolling(streamKey, consumerGroup, consumerName, handler);
  }

  private async startPolling<T extends DomainEvent>(
    streamKey: string,
    consumerGroup: string,
    consumerName: string,
    handler: EventHandler<T>,
  ) {
    while (this.isRunning) {
      try {
        const results = await this.subscriber.xreadgroup(
          'GROUP',
          consumerGroup,
          consumerName,
          'COUNT',
          10,
          'BLOCK',
          2000,
          'STREAMS',
          streamKey,
          '>',
        );

        if (!results || results.length === 0) continue;

        for (const [_, entries] of results as [string, [string, string[]][]][]) {
          for (const [entryId, fields] of entries) {
            const rawPayload = fields[1];
            if (!rawPayload) continue;

            let parsedEvent: T;
            try {
              parsedEvent = JSON.parse(rawPayload);
            } catch (parseErr) {
              console.error(`[RedisStreamsEventBus] Corrupt payload in ${streamKey}:`, parseErr);
              await this.subscriber.xack(streamKey, consumerGroup, entryId);
              continue;
            }

            let attempt = 0;
            let success = false;

            while (attempt < this.maxRetries && !success) {
              try {
                attempt++;
                await handler(parsedEvent);
                success = true;
                await this.subscriber.xack(streamKey, consumerGroup, entryId);
              } catch (handlerErr) {
                console.error(
                  `[RedisStreamsEventBus] Handler attempt ${attempt}/${this.maxRetries} failed for event ${parsedEvent.eventId}:`,
                  handlerErr,
                );
                if (attempt < this.maxRetries) {
                  // Exponential backoff with jitter
                  const backoff = Math.pow(2, attempt) * 200 + Math.random() * 100;
                  await new Promise((res) => setTimeout(res, backoff));
                } else {
                  // Route to Dead Letter Queue (DLQ)
                  await this.publisher.xadd(
                    'studypal:events:dlq',
                    '*',
                    'originalStream',
                    streamKey,
                    'failedGroup',
                    consumerGroup,
                    'payload',
                    rawPayload,
                    'error',
                    String(handlerErr),
                  );
                  await this.subscriber.xack(streamKey, consumerGroup, entryId);
                }
              }
            }
          }
        }
      } catch (err: any) {
        if (!this.isRunning) break;
        // Don't spam logs on transient connection wait
        await new Promise((res) => setTimeout(res, 1000));
      }
    }
  }

  async close(): Promise<void> {
    this.isRunning = false;
    try {
      this.publisher.disconnect();
      this.subscriber.disconnect();
    } catch (_) {}
  }
}
