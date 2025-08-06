import { Module } from '@nestjs/common';
import { AuthModule } from './modules/http-api/auth/auth.module';
import { PrismaModule } from './modules/services/prisma/prisma.module';
import { RedisModule } from './modules/services/redis/redis.module';

@Module({
  imports: [AuthModule, PrismaModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
