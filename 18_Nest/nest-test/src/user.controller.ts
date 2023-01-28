import { Controller, Get } from '@nestjs/common';

@Controller()
export class UserController {
  @Get('/user')
  getHello(): string {
    return 'my nest';
  }
}
