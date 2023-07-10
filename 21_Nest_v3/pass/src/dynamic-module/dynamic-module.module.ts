import { DynamicModule, Module } from '@nestjs/common';
import { DynamicModuleService } from './dynamic-module.service';
import { DynamicModuleController } from './dynamic-module.controller';

@Module({
  // controllers: [DynamicModuleController],
  // providers: [DynamicModuleService],
})
export class DynamicModuleModule {
  static register(options: Record<string, any>): DynamicModule {
    console.log(11, options);
    return {
      module: DynamicModuleModule,
      controllers: [DynamicModuleController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        DynamicModuleService,
      ],
      exports: [],
    };
  }
  // 配置一次模块用多次，比如 XxxModule.forRoot({}) 一次，之后就一直用这个 Module，一般在 AppModule 里 import
  static forRoot() {}
  // 用了 forRoot 固定了整体模块，用于局部的时候，可能需要再传一些配置，比如用 forRoot 指定了数据库链接信息，再用 forFeature 指定某个模块访问哪个数据库和表。
  static forFeature() {}
}
