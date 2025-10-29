import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../services/prisma/prisma.service';
import { RedisService } from '../services/redis/redis.service';

@Injectable()
export class ClearCacheCourseLessonsInterceptor implements NestInterceptor {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { lessonId, episodeId } = req.params;

    return next.handle().pipe(
      tap(async () => {
        let courseId: any = null;

        if (lessonId) {
          const lessonData = await this.prismaService.lesson.findUnique({
            where: { id: Number(lessonId) },
            select: { course: { select: { id: true } } },
          });
          courseId = lessonData?.course.id;
        } else if (episodeId) {
          const episodeData = await this.prismaService.episode.findUnique({
            where: { id: Number(episodeId) },
            select: {
              lesson: { select: { course: { select: { id: true } } } },
            },
          });
          courseId = episodeData?.lesson.course.id;
        }

        if (!courseId) return;

        await this.redisService.del(
          `cache:courses:get-course-lessons-${courseId}`,
        );
      }),
    );
  }
}
