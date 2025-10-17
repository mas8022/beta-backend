import { Global, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URI!, {
      lazyConnect: true,
      maxRetriesPerRequest: 5,
      reconnectOnError: () => true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      ttl
        ? await this.client.set(key, data, 'EX', ttl)
        : await this.client.set(key, data);
    } catch (err) {
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
    }
  }

  async handleKeysByPrefix(prefixOrPattern: string, clear = false): Promise<string[]> {
    const pattern = prefixOrPattern.includes('*')
      ? prefixOrPattern
      : `${prefixOrPattern}:*`;

    const keys: string[] = [];
    let cursor = '0';

    try {
      do {
        const [nextCursor, foundKeys] = await this.client.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        keys.push(...foundKeys);
        cursor = nextCursor;
      } while (cursor !== '0');

      if (clear && keys.length > 0) {
        const chunkSize = 500;
        for (let i = 0; i < keys.length; i += chunkSize) {
          const chunk = keys.slice(i, i + chunkSize);
          await this.client.del(...chunk);
        }
      }

      return keys;
    } catch (err) {
      return [];
    }
  }
}
