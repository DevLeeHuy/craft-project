import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Milliseconds } from 'cache-manager';

@Injectable()
export class CachingService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T> {
    return this.cacheManager.get(key);
  }

  async set<T>(key: string, value: T, ttl?: Milliseconds): Promise<void> {
    return this.cacheManager.set(key, value, ttl);
  }
}
