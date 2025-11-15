import {
  Global,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URI!, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('Redis connected successfully');
    } catch (err) {
      console.error('❌ Redis connection failed:', err.message);
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async set(key: string, value: any, ttl?: number) {
    const data = typeof value === 'string' ? value : JSON.stringify(value);

    return ttl
      ? await this.client.set(key, data, 'EX', ttl)
      : await this.client.set(key, data);
  }

  async del(key: string) {
    return await this.client.del(key);
  }

  async handleKeysByPrefix(
    prefixOrPattern: string,
    clear = false,
  ): Promise<string[]> {
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
          200,
        );

        if (foundKeys.length) keys.push(...foundKeys);

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
    } catch (err: any) {
      return [];
    }
  }
}
