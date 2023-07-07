import {
  Controller,
  Get,
  Headers,
  Inject,
  SetMetadata,
  UseGuards,
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

// @Controller()
// @Hhh()
@Iii('thunder', 'chen')
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
}
