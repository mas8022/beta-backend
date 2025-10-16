import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, Observable, of, switchMap } from 'rxjs';
import { RedisService } from 'src/common/services/redis/redis.service';

@Injectable()
export class CacheCourseLessonsInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const key = `cache:courses:get-course-lessons-${req.params.courseId}`;

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
