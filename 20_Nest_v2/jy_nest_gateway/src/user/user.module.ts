import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FsController } from './fs/fs.controller';
import { FsService } from './fs/fs.service';

@Module({
  controllers: [UserController, FsController],
  providers: [UserService, FsService],
})
export class UserModule {}
