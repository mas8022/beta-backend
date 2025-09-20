import { Module } from '@nestjs/common';
import { FinancialsService } from './financials.service';
import { FinancialsController } from './financials.controller';
import { ZibalModule } from 'src/common/services/zibal/zibal.module';

@Module({
  imports: [ZibalModule],
  controllers: [FinancialsController],
  providers: [FinancialsService],
})
export class FinancialsModule {}
