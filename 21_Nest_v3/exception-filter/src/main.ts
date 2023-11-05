import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HelloFilter } from './hello.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //引入错误过滤器
  // app.useGlobalFilters(new HelloFilter());
  await app.listen(3000);
}
bootstrap();
