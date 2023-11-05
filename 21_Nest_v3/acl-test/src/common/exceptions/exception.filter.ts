/*
 * @Author: thunderchen
 * @Date: 2023-05-27 23:58:14
 * @LastEditTime: 2023-07-31 22:23:08
 * @email: 853524319@qq.com
 * @Description: 捕获所有异常 Catch 的参数为空时，默认捕获所有异常
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    //打印错误信息
    console.log(23, exception);

    request.log.error(exception);

    //非HTTP标准异常处理
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: new ServiceUnavailableException().getResponse(),
    });
  }
}
