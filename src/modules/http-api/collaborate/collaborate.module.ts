import { Module } from '@nestjs/common';
import { CollaborateService } from './collaborate.service';
import { CollaborateController } from './collaborate.controller';

@Module({
  controllers: [CollaborateController],
  providers: [CollaborateService],
})
export class CollaborateModule {}
