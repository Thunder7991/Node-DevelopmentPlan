import {
  Controller,
  Get,
  Headers,
  Inject,
  Next,
  Response,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GuardGuard } from './guard/guard.guard';
import {
  Decorator,
  Fff,
  Ggg,
  Hhh,
  Iii,
  MyHeaders,
  MyQuery,
} from './decorator/decorator.decorator';
import { FilterFilter } from './filter/filter.filter';
import { AaaException } from './filter/AaaException';
import { FilterguardGuard } from './filterguard/filterguard.guard';
import { Roles } from './role/role.decorator';
import { Role } from './role/role';
import { MdGuardGuard } from './md-guard/md-guard.guard';
import { MdInterInterceptor } from './md-inter/md-inter.interceptor';

// @Controller()
// @Hhh()
@Iii('thunder', 'chen')
//可以放到Class上
@SetMetadata('rolesArr', ['admin'])
export class AppController {
  constructor(
    @Inject('app_service') private readonly appService: AppService,
    // private readonly appService: AppService,
    @Inject('person') private readonly person: { name: string; age: number },
    @Inject('person2')
    private readonly person2: { name: string; desc: string },
    @Inject('person5')
    private readonly persion5: { name: string; desc: string },
  ) {}

  //自定义装饰器
  @Get()
  @SetMetadata('decorator', 'admin')
  @UseGuards(GuardGuard)
  getHello(): string {
    // debugger;
    console.log(this.person);
    console.log(this.person2);
    console.log(this.persion5);

    return this.appService.getHello();
  }

  @Get('hello')
  @Decorator('decorator')
  @UseGuards(GuardGuard)
  getHello2(): string {
    return this.appService.getHello();
  }

  @Fff('hello2', 'thunderchen')
  getHello3(@Ggg() c): string {
    return this.appService.getHello();
  }

  @Fff('hello3', 'thunderchen')
  getHello4(@Ggg() c): string {
    return c;
  }
  @Fff('hello5', 'thunderchen')
  getHello5(@Headers('Accept') Header, @MyHeaders('Accept') headers) {
    console.log(Header);
  }
  @Fff('hello6', 'thunderchen')
  getHello6(@Headers('Accept') Header, @MyQuery('chen') query) {
    console.log('query', query);
  }

  //路由级别使用Aaafilter
  @Get('filter')
  @UseFilters(FilterFilter)
  @UseGuards(FilterguardGuard)
  @Roles(Role.Admin)
  getHello7(): string {
    throw new AaaException('aaa', 'bbb');
    return this.appService.getHello();
  }

  //metaData 元数据
  @Get('metadata')
  @UseGuards(MdGuardGuard)
  @UseInterceptors(MdInterInterceptor)
  @SetMetadata('rolesArr', ['admin'])
  getHello8(): string {
    return this.appService.getHello();
  }

  @Get('midd1')
  getMidd1(): string {
    console.log('midd1');
    return this.appService.getHello();
  }
  @Get('midd2')
  getMidd2(): string {
    console.log('midd2');
    return this.appService.getHello();
  }

  @Get('ware1')
  getMidd3(): string {
    console.log('ware1');
    return this.appService.getHello();
  }

  // @Get('aaa')
  // nest(@Next() next, @Response({ passthrough: false }) response) {
  //   console.log(next, response);
  //   return 'hello';
  // }
  @Get('aaa')
  nest(@Next() next) {
    next();
    return 'hello'; //hello2
  }
  @Get('aaa')
  b2() {
    return 'hello2';
  }
}
