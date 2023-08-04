import { Module } from '@nestjs/common';
import { DcService } from './dc.service';
import { DcController } from './dc.controller';

@Module({
  controllers: [DcController],
  providers: [DcService]
})
export class DcModule {}
