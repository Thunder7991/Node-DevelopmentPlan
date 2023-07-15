import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AppService } from '../app.service';

@Injectable()
export class TestRxmapInterceptor implements NestInterceptor {
  constructor(private appService: AppService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(14, this.appService.getHello());

    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          message: 'success',
          data,
        };
      }),
    );
  }
}
