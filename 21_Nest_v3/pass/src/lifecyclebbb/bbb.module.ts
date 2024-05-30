import { Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';
import { AaaModule } from '../aaa/aaa.module';

@Module({
  controllers: [BbbController],
  providers: [BbbService],
  //这样就可以在BbbModule中注入AaaService了
  //如果子模块中开启了@Global 可以省略掉
  imports: [AaaModule],
})
export class BbbModule {}
