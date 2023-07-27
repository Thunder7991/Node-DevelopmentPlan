import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  PrimaryColumnCannotBeNullableError,
  Repository,
} from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // @InjectEntityManager()
  // private manager: EntityManager;

  create(createUserDto: CreateUserDto) {
    console.log(16, createUserDto, User);
    // return this.manager.save(User, createUserDto);
    // return this.manager.getRepository(User).save(createUserDto);

    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.manager.find(User);
  }

  findOne(id: number) {
    return this.manager.findOne(User, {
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.manager.save(User, {
      id,
      ...updateUserDto,
    });
  }

  remove(id: number) {
    return this.manager.delete(User, id);
  }
}
