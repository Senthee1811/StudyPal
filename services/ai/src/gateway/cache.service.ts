import { Injectable } from '@nestjs/common';

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class GatewayCacheService {
  private readonly memoryCache = new Map<string, CacheEntry<any>>();

  public get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.value;
  }

  public set<T>(key: string, value: T, ttlSeconds: number): void {
    if (ttlSeconds <= 0) return;

    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  public createCacheKey(prefix: string, payload: any): string {
    const str = typeof payload === 'string' ? payload : JSON.stringify(payload);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `${prefix}:${hash}`;
  }
}
