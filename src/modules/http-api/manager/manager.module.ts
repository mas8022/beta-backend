import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { BucketModule } from 'src/modules/services/bucket/bucket.module';

@Module({
  imports: [BucketModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
