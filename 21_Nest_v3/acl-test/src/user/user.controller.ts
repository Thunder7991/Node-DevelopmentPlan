import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';

import { Inject, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { GlobalInterceptor } from '../common/interceptors/global.interceptor';

@Controller('user')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService;

  constructor(private readonly userService: UserService) {}
  @Get('init')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  @UseInterceptors(GlobalInterceptor)
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);

    if (user) {
      const token = await this.jwtService.signAsync({
        user: {
          id: user.id,
          username: user.username,
        },
      });
      return {
        message: 'login success',
        token: token,
        code: HttpStatus.OK,
      };
    } else {
      return {
        message: '当前用户未注册',
        code: HttpStatus.NOT_FOUND,
      };
    }
  }
}
