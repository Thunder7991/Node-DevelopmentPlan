import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Res,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';

import { LoginDto } from './dto/login_dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { GlobalInterceptor } from 'src/global/global.interceptor';
import { LoginGuard } from 'src/login/login.guard';

@Controller('user')
export class UserController {
  @Inject(JwtService) private jwtService: JwtService;

  constructor(private readonly userService: UserService) {}
  @Post('login')
  @UseInterceptors(GlobalInterceptor)
  async login(
    @Body(ValidationPipe) user: LoginDto,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    const findUser = await this.userService.login(user);
    if (findUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: findUser.id,
          username: findUser.username,
        },
      });
      return {
        message: 'login success',
        token: token,
        code: HttpStatus.OK,
      };
    } else {
      return 'login fail';
    }
  }

  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userService.register(user);
  }

  @Get('aaa')
  @UseGuards(LoginGuard)
  aaa() {
    return 'aaa';
  }

  @Get('bbb')
  @UseGuards(LoginGuard)
  bbb() {
    return 'bbb';
  }
}
