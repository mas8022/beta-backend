import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Type,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from 'src/common/services/redis/redis.service';

export function ClearCacheInterceptor(prefix: string): Type<NestInterceptor> {
  @Injectable()
  class ClearCacheInterceptorClass implements NestInterceptor {
    constructor(private readonly redisService: RedisService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        tap(async () => {
          try {
            await this.redisService.handleKeysByPrefix(prefix, true);
          } catch (err) {}
        }),
      );
    }
  }

  return ClearCacheInterceptorClass;
}
