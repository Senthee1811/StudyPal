import { DomainEvent } from '@studypal/contracts';

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void>;

export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: string,
    consumerGroup: string,
    handler: EventHandler<T>,
  ): Promise<void>;
  close(): Promise<void>;
}
