import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user.login.dto';

import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(JwtService)
  private jwtService: JwtService;

  constructor(private readonly userService: UserService) {}

  @Get('init')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  async login(@Body() loginUser: UserLoginDto) {
    const user = await this.userService.login(loginUser);

    const token = this.jwtService.sign({
      user: {
        username: user.username,
        roles: user.roles,
      },
    });
    return {
      token,
    };
  }
}
