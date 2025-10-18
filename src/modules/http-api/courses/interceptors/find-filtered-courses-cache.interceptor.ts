import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
    const cacheData = rawCache ? JSON.parse(rawCache) : null;

    return of(cacheData).pipe(
      switchMap((cached) => {
        if (cached) {
          return of(cached);
        }
        return next.handle().pipe(
          tap(async (data) => {
            await this.redisService.set(key, data);
          }),
        );
      }),
    );
  }
}
