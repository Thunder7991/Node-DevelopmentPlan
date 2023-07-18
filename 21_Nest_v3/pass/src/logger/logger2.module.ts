import { DynamicModule, Global, Module } from '@nestjs/common';
import { MyLogger4 } from 'src/customLogger/MyLogger';

//动态模块
@Module({})
export class Logger2Module {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: Logger2Module,
      providers: [
        MyLogger4,
        {
          provide: 'LOG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [MyLogger4, 'LOG_OPTIONS'],
    };
  }
}
