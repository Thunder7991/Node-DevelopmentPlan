import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('接口文档标题')
    .setDescription('描述')
    .setVersion('1.0')
    .addTag('标签')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000, () => {
    console.log('http://127.0.0.1:3000');
  });
}
bootstrap();
