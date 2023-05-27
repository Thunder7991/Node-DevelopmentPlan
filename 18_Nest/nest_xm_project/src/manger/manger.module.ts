import { Module } from '@nestjs/common';
import { MangerService } from './manger.service';
import { MangerController } from './manger.controller';

@Module({
  controllers: [MangerController],
  providers: [MangerService]
})
export class MangerModule {}
