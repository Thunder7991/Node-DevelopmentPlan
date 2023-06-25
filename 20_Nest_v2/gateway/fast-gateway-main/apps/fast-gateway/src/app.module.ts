import { CacheModule, Module } from '@nestjs/common';

import { APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';
import { TransformInterceptor, getConfig } from '@app/common';
import * as redisStore from 'cache-manager-redis-store';
import { IntercepterModule } from './core/intercepter.module';

@Module({
  imports: [
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: getConfig('REDIS_CONFIG').host,
    //   port: getConfig('REDIS_CONFIG').port,
    //   auth_pass: getConfig('REDIS_CONFIG').auth,
    //   db: getConfig('REDIS_CONFIG').db
    // }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig]
    }),
    IntercepterModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
