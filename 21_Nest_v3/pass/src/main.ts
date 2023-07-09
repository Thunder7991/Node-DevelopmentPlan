import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FilterFilter } from './filter/filter.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //静态资源
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static' });

  //全局使用filter
  app.useGlobalFilters(new FilterFilter());
  // setTimeout(() => {
  //   app.close();
  // }, 3000);
  await app.listen(3000);
}
bootstrap();
