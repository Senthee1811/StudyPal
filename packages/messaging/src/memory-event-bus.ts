import { DomainEvent } from '@studypal/contracts';
import { EventHandler, IEventBus } from './event-bus.interface.js';

export class MemoryEventBus implements IEventBus {
  private handlers = new Map<string, EventHandler<any>[]>();

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const list = this.handlers.get(event.eventType) || [];
    for (const handler of list) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[MemoryEventBus] Handler failed for event ${event.eventType}:`, err);
      }
    }
  }

  async subscribe<T extends DomainEvent>(
    eventType: string,
    consumerGroup: string,
    handler: EventHandler<T>,
  ): Promise<void> {
    const list = this.handlers.get(eventType) || [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  async close(): Promise<void> {
    this.handlers.clear();
  }
}
