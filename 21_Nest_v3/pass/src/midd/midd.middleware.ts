import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from 'src/app.service';

@Injectable()
export class MiddMiddleware implements NestMiddleware {
  // @Inject(AppService)
  // private readonly appService: AppService;
  constructor(private readonly appService: AppService) {}
  use(req: Request, res: Response, next: () => void) {
    console.log('before');
    console.log(this.appService.getHello());
    next();
    console.log('after');
  }
}
