import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './user.controller';

import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [UserController, AppController],
  providers: [AppService],
})
export class AppModule {}
