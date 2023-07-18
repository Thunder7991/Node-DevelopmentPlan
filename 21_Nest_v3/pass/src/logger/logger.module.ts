import { DynamicModule, Global, Module } from '@nestjs/common';
import { MyLogger2 } from 'src/customLogger/MyLogger';

@Global()
@Module({
  providers: [MyLogger2],
  exports: [MyLogger2],
})
export class LoggerModule {}
