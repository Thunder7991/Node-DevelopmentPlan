import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { UnloginFilter } from './unlogin.filter';
import { CustomExceptionFilter } from './custom-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //静态资源
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });
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

  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('API 接口文档')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: 'Basic Auth',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  console.log(document);
  SwaggerModule.setup('api-docs', app, document);

  //添加跨域
  app.enableCors();

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
