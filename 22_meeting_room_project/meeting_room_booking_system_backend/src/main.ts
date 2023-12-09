import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { UnloginFilter } from './unlogin.filter';
import { CustomExceptionFilter } from './custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //对请求体做校验 全局启用
  app.useGlobalPipes(new ValidationPipe());
  //全局启用响应拦截器
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  //全局启用logger
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  //添加全局过滤器
  // app.useGlobalFilters(new UnloginFilter());

  //自定义过滤器
  app.useGlobalFilters(new CustomExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
