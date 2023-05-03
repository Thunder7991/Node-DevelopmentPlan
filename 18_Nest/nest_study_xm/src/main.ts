import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Response } from './common/response';
import { HttpFilter } from './common/filter';
//第二种方式
// import { RoleGuard } from './guard/role/role.guard';

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

  app.useGlobalInterceptors(new Response());
  app.useGlobalFilters(new HttpFilter());
  //官方自带校验
  app.useGlobalPipes(new ValidationPipe());
  //第二种方式
  // app.useGlobalGuards(new RoleGuard());
  await app.listen(3000);
}
bootstrap();
