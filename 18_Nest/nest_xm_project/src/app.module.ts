import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MangerModule } from './manger/manger.module';

@Module({
  imports: [UserModule, MangerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
