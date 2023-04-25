import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoController } from './demo/demo.controller';
import { DemoModule } from './demo/demo.module';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';
import { UploadModule } from './upload/upload.module';
import { UserService } from './user/user.service';
import { PModule } from './p/p.module';
import { LoginModule } from './login/login.module';
import { SpiderModule } from './spider/spider.module';
// app.module.ts 跟模块用于处理其他类的引用与共享.
// app.controller.ts 常见功能是用来处理Http请求以及调用service层处理方法
//app.service.ts 封账通用的业务逻辑,与数据层交互,其他额外的一些三方请求
@Module({
  imports: [
    DemoModule,
    UserModule,
    ListModule,
    UploadModule,
    PModule,
    LoginModule,
    SpiderModule,
  ],
  controllers: [AppController, DemoController],
  providers: [
    UserService,
    // test,
    {
      provide: 'ABC',
      useClass: AppService,
    },
    {
      // 自定义值
      provide: 'Test',
      useValue: ['thunder', 'chen'],
    },
    //工厂模式
    // {
    //   provide: 'CCC',
    //   inject: [test],
    //   useFactory(test: test) {
    //     return 123;
    //   },
    // },
  ],
})
export class AppModule {}
