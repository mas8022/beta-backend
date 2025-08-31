import { Module } from '@nestjs/common';
import { PocketService } from './pocket.service';

@Module({
  providers: [PocketService],
  exports: [PocketService],
})
export class PocketModule {}
