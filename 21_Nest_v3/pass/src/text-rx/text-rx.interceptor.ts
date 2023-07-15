import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppService } from 'src/app.service';

@Injectable()
export class TextRxInterceptor implements NestInterceptor {
  // 路由级别和全局级别的 interceptor 还是有区别的，路由级别的可以注入依赖，而全局的不行：
  constructor(private appService: AppService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(this.appService.getHello());

    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`after ${Date.now() - now}ms`)));
  }
}
