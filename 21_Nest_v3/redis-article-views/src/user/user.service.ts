import { Injectable,BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  //实现登录逻辑
  @InjectEntityManager()
  private entityManager: EntityManager;

  async login(loginUser: LoginUserDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username: loginUser.username,
      },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (user.password !== loginUser.password) {
      throw new BadRequestException('密码错误');
    }

    return user;
  }
}
