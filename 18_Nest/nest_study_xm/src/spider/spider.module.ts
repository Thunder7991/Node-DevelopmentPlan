import { Module } from '@nestjs/common';
import { SpiderService } from './spider.service';
import { SpiderController } from './spider.controller';

@Module({
  controllers: [SpiderController],
  providers: [SpiderService]
})
export class SpiderModule {}
