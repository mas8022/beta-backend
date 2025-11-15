import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from 'src/common/services/redis/redis.service';

@Injectable()
export class CacheFindFilteredCoursesInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const queryString = new URLSearchParams(
      req.query as Record<string, string>,
    ).toString();
    const key = `cache:courses:find-filtered:${queryString || 'all'}`;

    const rawCache = await this.redisService.get(key);
    if (rawCache) {
      const cacheData = JSON.parse(rawCache);
      return of(cacheData);
    }

    return next.handle().pipe(
      tap(async (data) => {
        if (data?.data?.length) {
          await this.redisService.set(key, JSON.stringify(data));
        }
      }),
    );
  }
}
