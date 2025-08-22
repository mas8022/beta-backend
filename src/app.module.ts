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

@Module({
  imports: [AuthModule, PrismaModule, RedisModule, UsersModule, ContactUsModule, CollaborateModule, CoursesModule, FinancialsModule, ZibalModule],
})
export class AppModule {}
