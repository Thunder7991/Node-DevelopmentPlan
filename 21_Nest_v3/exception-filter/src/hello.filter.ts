import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Catch(BadRequestException)
export class HelloFilter<T> implements ExceptionFilter {
  // catch(exception: BadRequestException, host: ArgumentsHost) {

  @Inject(AppService)
  private service: AppService;

  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const statusCode = exception.getStatus();

    //加入验证管道 validation pipe
    const res = exception.getResponse() as { message: string[] };

    response.status(statusCode).json({
      code: statusCode,
      message: res?.message?.join ? res.message?.join(',') : exception.message,
      error: 'Bad Request',
      xxx: 111,
      vvv: this.service.getHello(),
    });
  }
}
