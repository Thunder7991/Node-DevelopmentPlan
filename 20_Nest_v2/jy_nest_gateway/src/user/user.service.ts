import { Inject, Injectable } from '@nestjs/common';
import { AddUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.mongo.entity';
import { FsUserInfo } from './fs/fs.dto';

@Injectable()
export class UserService {
  // constructor(
  //   @Inject('USER_REPOSITORY') private userRepository: MongoRepository<User>,
  // ) {}
  constructor() {}

  createOrSave(user) {
    // return this.userRepository.save(user);
  }
  // create(createUserDto: AddUserDto) {
  //   return 'This action adds a new user';
  // }

  async createOrUpdateByFeishu(FsUserInfo: FsUserInfo) {
    // return await this.userRepository.save(FsUserInfo);
  }
}
