import { Module } from '@nestjs/common';
import { AuthModule } from './modules/http-api/auth/auth.module';
import { PrismaModule } from './modules/services/prisma/prisma.module';
import { RedisModule } from './modules/services/redis/redis.module';
import { UsersModule } from './modules/http-api/users/users.module';
import { ContactUsModule } from './modules/http-api/contact-us/contact-us.module';
import { CollaborateModule } from './modules/http-api/collaborate/collaborate.module';

@Module({
  imports: [AuthModule, PrismaModule, RedisModule, UsersModule, ContactUsModule, CollaborateModule],
})
export class AppModule {}
