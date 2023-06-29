import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    @Inject('app_service') private readonly appService: AppService,
    @Inject('pserson') private readonly person: { name: string; age: number },
    @Inject('pserson2')
    private readonly person2: { name: string; desc: string },
    @Inject('pserson5')
    private readonly persion5: { name: string; desc: string },
  ) {}

  @Get()
  getHello(): string {
    // debugger;
    console.log(this.person);
    console.log(this.person2);
    console.log(this.persion5);

    return this.appService.getHello();
  }
}
