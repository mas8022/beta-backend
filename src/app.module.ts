import { Module } from '@nestjs/common';
import { AuthModule } from './modules/http-api/auth/auth.module';
import { PrismaModule } from './modules/services/prisma/prisma.module';
import { RedisModule } from './modules/services/redis/redis.module';
import { UsersModule } from './modules/http-api/users/users.module';
import { ContactUsModule } from './modules/http-api/contact-us/contact-us.module';
import { CollaborateModule } from './modules/http-api/collaborate/collaborate.module';
import { CoursesModule } from './modules/http-api/courses/courses.module';
import { FinancialsModule } from './modules/http-api/financials/financials.module';
import { ZibalModule } from './modules/services/zibal/zibal.module';
import { AuthorsModule } from './modules/http-api/authors/authors.module';
import { BucketModule } from './modules/services/bucket/bucket.module';
import { ManagerModule } from './modules/http-api/manager/manager.module';

@Module({
  imports: [AuthModule, PrismaModule, RedisModule, UsersModule, ContactUsModule, CollaborateModule, CoursesModule, FinancialsModule, ZibalModule, AuthorsModule, BucketModule, ManagerModule],
})
export class AppModule {}
