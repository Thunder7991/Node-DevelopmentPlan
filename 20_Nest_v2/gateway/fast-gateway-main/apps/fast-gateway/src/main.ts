declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import fastify from 'fastify';
import * as cookieParser from 'cookie-parser';

import { VERSION_NEUTRAL } from '@nestjs/common'

import { generateDocument } from './doc'
import { FastifyLogger, catchError, AllExceptionsFilter, HttpExceptionFilter } from '@app/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';

catchError()

async function bootstrap() {

  // 初始化 fastify 
  const fastifyInstance = fastify({
    logger: FastifyLogger({
      fileName: 'fast-gateway'
    }),
  })

  // 创建 NEST 实例
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance)
  );

  app.register(fastifyCookie, {
    secret: 'my-secret', // for cookies signature
  });

  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 设置全局接口前缀
  app.setGlobalPrefix('api', { exclude: ['*'] });

  // 格式化 cookie
  app.use(cookieParser());

  // 接口版本化管理
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 启动全局字段校验，保证请求接口字段校验正确。
  app.useGlobalPipes(new ValidationPipe());

  // 创建文档
  generateDocument(app)

  // 启动服务 
  await app.listen(8080);

  // 添加热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
