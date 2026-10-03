export interface IIdempotencyStore {
  isProcessed(eventId: string): Promise<boolean>;
  markProcessed(eventId: string, ttlSeconds?: number): Promise<void>;
}

export class MemoryIdempotencyStore implements IIdempotencyStore {
  private processedEvents = new Map<string, number>();

  async isProcessed(eventId: string): Promise<boolean> {
    const expiresAt = this.processedEvents.get(eventId);
    if (!expiresAt) return false;
    if (Date.now() > expiresAt) {
      this.processedEvents.delete(eventId);
      return false;
    }
    return true;
  }

  async markProcessed(eventId: string, ttlSeconds = 86400): Promise<void> {
    this.processedEvents.set(eventId, Date.now() + ttlSeconds * 1000);
  }
}
