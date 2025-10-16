import { Global, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Injectable()
export class RedisService implements OnModuleDestroy {
  private client = new Redis(process.env.REDIS_URI!);

  onModuleDestroy() {
    this.client.quit();
  }

  get(key: string) {
    return this.client.get(key);
  }

  set(key: string, value: string, ttl?: number) {
    return ttl
      ? this.client.set(key, value, 'EX', ttl)
      : this.client.set(key, value);
  }

  del(key: string) {
    return this.client.del(key);
  }

  async handleKeysByPrefix(prefixOrPattern: string, clear = false) {
    const pattern = prefixOrPattern.includes('*')
      ? prefixOrPattern
      : `${prefixOrPattern}:*`;

    const keys: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, foundKeys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100, // هر بار تا 100 تا کلید اسکن می‌کنه (می‌تونی بیشتر یا کمتر بذاری)
      );
      keys.push(...foundKeys);
      cursor = nextCursor;
    } while (cursor !== '0');

    if (clear && keys.length > 0) {
      await this.client.del(...keys);
    }

    return keys;
  }
}
