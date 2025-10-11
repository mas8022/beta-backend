import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ZibalModule } from 'src/common/services/zibal/zibal.module';

@Global()
@Module({
  imports: [ZibalModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
