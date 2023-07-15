import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class TestRxcatcherrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TestRxcatcherrorInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.log(16, err);
        this.logger.error(err.message, err.stack);
        return throwError(() => err);
      }),
    );
  }
}
