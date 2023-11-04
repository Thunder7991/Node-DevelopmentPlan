import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //设置静态资源目录
  app.useStaticAssets('static', { prefix: '/pages' });

  await app.listen(3000);
}
bootstrap();

// 二维码登录 , 安装相关的依赖包  qrcode @types/qrcode
