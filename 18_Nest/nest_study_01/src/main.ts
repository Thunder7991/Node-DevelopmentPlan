import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //添加路径
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/thunderchen',
  });
  //版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cors());
  // session
  app.use(
    session({
      secret: 'thunderchen',
      rolling: true,
      name: 'sid',
      cookie: {
        maxAge: 999999,
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
