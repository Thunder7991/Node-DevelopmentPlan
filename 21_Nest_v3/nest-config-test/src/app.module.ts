import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BbbModule } from './bbb/bbb.module';
import config from '../config';
import config2 from 'config2';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 也可使用ConfigModule.forFeautrue来注册局部配置
      // envFilePath: [
      //   //前面的配置会覆盖后面的配置
      //   join(process.cwd(), '.aaa.env'),
      //   join(process.cwd(), '.env'),
      // ],
      load: [config2, config],
    }),
    BbbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
