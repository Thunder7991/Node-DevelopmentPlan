import {
  Controller,
  Get,
  Headers,
  Inject,
  Request,
  Res,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { PassThrough } from 'stream';
import { Response } from 'express';

@Controller()
export class AppController {
  @Inject()
  private jwtService: JwtService;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('sss')
  sss(@Session() session, @Headers() headers) {
    // console.log(session);
    console.log(headers);

    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }
  @Get('ttt')
  ttt(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const data = this.jwtService.verify(token);
        const newToken = this.jwtService.sign({
          count: data.count + 1,
        });
        response.setHeader('token', newToken);
        return data.count + 1;
      } catch (error) {
        console.log(error);
        throw new UnauthorizedException('token 验证失败');
      }
    } else {
      // 生成一个 jwt token，放到 response header 里。
      const newToken = this.jwtService.sign({
        count: 1,
      });
      response.setHeader('token', newToken);
      return 1;
    }
  }
}
