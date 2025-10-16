import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RedisService } from 'src/common/services/redis/redis.service';

@Injectable()
export class CacheFindFilteredCoursesInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const key = `cache:courses:find-filtered:${new URLSearchParams(req.query as Record<string, string>).toString() || 'all'}`;

    const redisCall = this.redisService.get(key);
    const cache$ = redisCall ? from(redisCall) : of(null);

    return cache$.pipe(
      switchMap((cached) => {
        if (cached && cached !== 'null' && cached !== 'undefined') {
          try {
            return of(JSON.parse(cached));
          } catch {}
        }

        return next.handle().pipe(
          switchMap(async (data) => {
            await this.redisService.set(key, JSON.stringify(data));
            return data;
          }),
        );
      }),
    );
  }
}
