import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Record<string, number> {
    return {
      // aaa: this.configService.get('aaa'),
      // bbb: this.configService.get('bbb'),
      // db: this.configService.get('db'),
      config: this.configService.get('aaa.bbb.ccc'),
    };
  }
}
