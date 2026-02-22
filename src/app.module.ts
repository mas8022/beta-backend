import { Module } from '@nestjs/common';
import { AuthModule } from './modules/http-api/auth/auth.module';
import { PrismaModule } from './common/services/prisma/prisma.module';
import { RedisModule } from './common/services/redis/redis.module';
import { UsersModule } from './modules/http-api/users/users.module';
import { ContactUsModule } from './modules/http-api/contact-us/contact-us.module';
import { CollaborateModule } from './modules/http-api/collaborate/collaborate.module';
import { CoursesModule } from './modules/http-api/courses/courses.module';
import { ZibalModule } from './common/services/zibal/zibal.module';
import { AuthorsModule } from './modules/http-api/authors/authors.module';
import { BucketModule } from './common/services/bucket/bucket.module';
import { ManagerModule } from './modules/http-api/manager/manager.module';
import { UploadModule } from './modules/http-api/upload/upload.module';
import { AdminsModule } from './modules/http-api/admins/admins.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SupervisorModule } from './modules/http-api/supervisor/supervisor.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 20,
        },
      ],
      ignoreUserAgents: [/googlebot/i],
    }),
    AuthModule,
    PrismaModule,
    RedisModule,
    UsersModule,
    ContactUsModule,
    CollaborateModule,
    CoursesModule,
    ZibalModule,
    AuthorsModule,
    BucketModule,
    ManagerModule,
    UploadModule,
    AdminsModule,
    SupervisorModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
