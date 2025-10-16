import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Type } from '@nestjs/common';
import { Observable, switchMap, from } from 'rxjs';
import { RedisService } from 'src/common/services/redis/redis.service';

export function ClearCacheInterceptor(prefix: string): Type<NestInterceptor> {
  @Injectable()
  class ClearCacheInterceptorClass implements NestInterceptor {
    constructor(private readonly redisService: RedisService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        switchMap((data) =>
          from(this.redisService.handleKeysByPrefix(prefix, true)).pipe(
            switchMap(() => from(Promise.resolve(data)))
          )
        )
      );
    }
  }

  return ClearCacheInterceptorClass;
}
