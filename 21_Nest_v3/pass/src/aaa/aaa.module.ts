import { Global, Module } from '@nestjs/common';
import { AaaService } from './aaa.service';
import { AaaController } from './aaa.controller';

//如果被多次引用
// @Global()
@Module({
  controllers: [AaaController],
  providers: [AaaService],
  exports: [AaaService],
})
export class AaaModule {}
