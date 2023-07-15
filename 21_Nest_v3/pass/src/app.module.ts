import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { CccModule } from './ccc/ccc.module';
import { DddModule } from './ddd/ddd.module';
import { ModuleaModule } from './modulea/modulea.module';
import { ModulebModule } from './moduleb/moduleb.module';
import { ProviderAService } from './provider-a/provider-a.service';
import { ProviderBService } from './provider-b/provider-b.service';
import { DynamicModuleModule } from './dynamic-module/dynamic-module.module';
import { MiddMiddleware } from './midd/midd.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TestRxmapInterceptor } from './test-rxmap/test-rxmap.interceptor';

@Module({
  imports: [
    PersonModule,
    AaaModule,
    BbbModule,
    CccModule,
    DddModule,
    ModuleaModule,
    ModulebModule,
    DynamicModuleModule.register({
      aaa: 1,
      bbb: 2,
    }),
  ],
  controllers: [AppController],
  // providers: [AppService],
  providers: [
    AppService,
    {
      provide: 'app_service',
      useClass: AppService,
    },
    {
      provide: 'person',
      useValue: {
        name: 'aaa',
        age: 20,
      },
    },
    //工厂
    {
      provide: 'person2',
      useFactory() {
        return {
          name: 'bbb',
          desc: 'ccc',
        };
      },
    },
    {
      //等于注入这两个 provider
      provide: 'person3',
      useFactory(person: { name: string }, appService: AppService) {
        return {
          name: person.name,
          desc: appService.getHello(),
        };
      },
      inject: ['person', AppService],
    },
    //上面等同于
    // [
    //   AppService,
    //   {
    //     provide: 'pserson',
    //     useValue: {
    //       name: 'aaa',
    //       age: 20,
    //     },
    //   },
    // ],

    // useFactory 支持异步：

    {
      provide: 'person5',
      // 通过useExisting指定别名
      useExisting: 'person6',
      async useFactory() {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });

        return {
          name: 'bbb',
          desc: 'ccc',
        };
      },
    },
    ProviderAService,
    ProviderBService,
    // 但很多情况下我们是需要全局 interceptor 的，而且还用到一些 provider
    // 使用这种方式注册拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TestRxmapInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //设置所有路由
    // consumer.apply(MiddMiddleware).forRoutes('*');

    //设置 midd1
    consumer
      .apply(MiddMiddleware)
      .forRoutes({ path: 'thunder/midd*', method: RequestMethod.GET });

    consumer
      .apply(MiddMiddleware)
      .forRoutes({ path: 'thunder/ware*', method: RequestMethod.GET });
  }
}
