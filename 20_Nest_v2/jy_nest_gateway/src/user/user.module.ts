import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FsController } from './fs/fs.controller';
import { FsService } from './fs/fs.service';
import { UserProviders } from './user.providers';
import { DatabaseModule } from '@/common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, FsController],
  providers: [...UserProviders, UserService, FsService],
  exports: [UserService],
})
export class UserModule {}
