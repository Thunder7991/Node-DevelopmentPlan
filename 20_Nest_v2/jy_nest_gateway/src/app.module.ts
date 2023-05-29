import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//环境配置 @nestjs/config
import { ConfigModule } from '@nestjs/config';
import { getConfig } from '@/utils';
import { UserModule } from './user/user.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      host: getConfig('REDIS_CONFIG').host,
      port: getConfig('REDIS_CONFIG').port,
      auth_pass: getConfig('REDIS_CONFIG').auth,
      db: getConfig('REDIS_CONFIG').db,
    }),
    ConfigModule.forRoot({
      //环境变量使用yaml ,禁用dotenv
      ignoreEnvFile: true,
      isGlobal: true,
      // load 方法中传入的 getConfig 是一个函数，并不是直接 JSON 格式的配置对象，直接添加变量会报错。
      load: [getConfig],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
