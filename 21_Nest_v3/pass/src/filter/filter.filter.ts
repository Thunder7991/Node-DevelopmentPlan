import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AaaException } from './AaaException';
import { Response, Request } from 'express';

// Nest 会 catch 所有未捕获异常，如果是 Exception Filter 声明的异常，那就会调用 filter 来处理。
@Catch(AaaException)
export class FilterFilter<T> implements ExceptionFilter {
  catch(exception: AaaException, host: ArgumentsHost) {
    // 第一个参数是异常对象，

    console.log(exception, host);
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      response.status(500).json({
        aaa: exception.aaa,
        bbb: exception.bbb,
      });
    } else if (host.getType() === 'ws') {
    } else if (host.getType() === 'rpc') {
    }
  }
}
