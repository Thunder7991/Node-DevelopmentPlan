import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HelloFilter } from './hello.filter';
import { UnLoginException } from './unlogin.filter';

@Controller()
// @UseFilters(HelloFilter) 局部引用
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseFilters(HelloFilter) 局部引用
  getHello(): string {
    //抛出一个错误
    // throw new HttpException('xxxx', HttpStatus.BAD_REQUEST);

    //直接抛具体的异常
    // throw new BadRequestException('xxxx');
    throw new UnLoginException()
    return this.appService.getHello();
  }
}
