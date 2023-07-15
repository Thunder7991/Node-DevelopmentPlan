import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';

// 接口如果长时间没返回，要给用户一个接口超时的响应，这时候就可以用 timeout
@Injectable()
export class TextRxtimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // timeout 操作符会在 3s 没收到消息的时候抛一个 TimeoutError。
      timeout(3000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          console.log(err);
          // return throwError(() => new RequestTimeoutException());
          return throwError(() => new HttpException('xxx', HttpStatus.FOUND));
        }
        return throwError(() => err);
      }),
    );
  }
}
