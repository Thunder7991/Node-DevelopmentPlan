import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //对请求体做校验 全局启用
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
