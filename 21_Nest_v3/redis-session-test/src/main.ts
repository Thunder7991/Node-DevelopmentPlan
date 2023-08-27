import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //用到cookie 需要安装cookie-parse的包
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
