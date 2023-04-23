import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller({
  path: 'app',
  version: '1',
})
export class AppController {
  constructor(
    @Inject('ABC') private readonly appService: AppService,
    @Inject('Test') private readonly name: string[],
    // @Inject('CCC') private readonly number: number,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string[] {
    // return this.appService.getName();
    return this.name;
  }
}
