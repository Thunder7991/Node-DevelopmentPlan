import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { HelloFilter } from './hello.filter';
import { UnloginFilter } from './unlogin.filter';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    //注册一个 token 为 APP_FILTER 的 provider：
    // Nest 会把所有 token 为 APP_FILTER 的 provider 注册为全局 Exception Filter。
    {
      provide: APP_FILTER,
      useClass: HelloFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnloginFilter,
    },
  ],
})
export class AppModule {}
