import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  //创建nest应用(引入跟模块)
  const app = await NestFactory.create(AppModule);
  //创建swagger 接口文档及接口测试应用
  const options = new DocumentBuilder()
    .setTitle('接口文档标题')
    .setDescription('描述')
    .setVersion('1.0')
    .addTag('标签')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  //监听端口
  await app.listen(3000, () => {
    console.log('http://127.0.0.1:3000');
  });
}
bootstrap();
