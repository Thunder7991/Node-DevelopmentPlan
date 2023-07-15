import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppService } from '../app.service';

// 使用 tap operator 来添加一些日志、缓存等逻辑：
@Injectable()
export class TestRxtapInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TestRxtapInterceptor.name);
  constructor(private appService: AppService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        this.appService.getHello();
        this.logger.log(`log something`, data);
      }),
    );
  }
}
