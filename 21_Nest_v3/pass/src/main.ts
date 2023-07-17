import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FilterFilter } from './filter/filter.filter';
import { TextRxInterceptor } from './text-rx/text-rx.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true, //支持跨域
  });

  //静态资源
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static' });

  //全局使用filter
  app.useGlobalFilters(new FilterFilter());
  // setTimeout(() => {
  //   app.close();
  // }, 3000);
  //全局使用拦截器 , 全局不能注入依赖
  // app.useGlobalInterceptors(new TextRxInterceptor());
  await app.listen(3000);
}
bootstrap();
