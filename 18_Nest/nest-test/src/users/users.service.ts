import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDocument, Users } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    //入库
    const createUser = await this.usersModel.create(createUserDto);
    return createUser;
  }

  async findAll() {
    return await this.usersModel.find().exec();
  }

  async findOne(id: number) {
    return await this.usersModel.findById(id).exec();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true, //新数据
      })
      .exec();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
