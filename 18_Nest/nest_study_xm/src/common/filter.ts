import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

/*
 * @Author: thunderchen
 * @Date: 2023-04-23 22:53:11
 * @LastEditTime: 2023-04-23 23:03:36
 * @email: 853524319@qq.com
 * @Description: 异常拦截器
 */
export class HttpFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      success: false,
      time: new Date(),
      data: exception.message,
      status,
      path: request.url,
    });
  }
}
