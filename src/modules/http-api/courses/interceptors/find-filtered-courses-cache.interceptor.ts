import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { RedisService } from 'src/common/services/redis/redis.service';

@Injectable()
export class CacheFindFilteredCoursesInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const queryString = new URLSearchParams(
      req.query as Record<string, string>,
    ).toString();

    const key = `cache:courses:find-filtered:${queryString || 'all'}`;

    return from(this.redisService.get(key)).pipe(
      switchMap((cached) => {
        if (cached) return of(cached);
        return next.handle().pipe(
          tap(async (data) => {
            await this.redisService.set(key, data);
          }),
        );
      }),
    );
  }
}
