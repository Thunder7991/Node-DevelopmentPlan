import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { BusinessException } from 'src/common/exceptions/business.exception';

@Controller({
  path: 'app',
  version: '1', //当前control所适用
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //第一种修改方式
  // @Version('1')
  //指定某一个版本
  @Version([VERSION_NEUTRAL, '1'])
  getHello(): string {
    return this.appService.getHello();
  }
  @Get()
  @Version('2')
  findAll(): string {
    return this.appService.getHello();
  }
  @Get('findError')
  @Version([VERSION_NEUTRAL, '1'])
  findError() {
    const a: any = {};
    console.log(a.b.c);
    return this.appService.getHello();
  }

  @Get('findBusinessError')
  @Version([VERSION_NEUTRAL, '1'])
  findBusinessError() {
    const a: any = {};
    try {
      console.log(a.b.c);
    } catch (error) {
      throw new BusinessException('你这个参数错了');
    }
    return this.appService.getHello();
  }
}
