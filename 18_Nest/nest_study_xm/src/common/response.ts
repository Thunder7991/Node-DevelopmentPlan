/*
 * @Author: thunderchen
 * @Date: 2023-04-23 22:20:09
 * @LastEditTime: 2023-04-23 22:46:51
 * @email: 853524319@qq.com
 * @Description:响应拦截器
 */
//
import { CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface Data<T> {
  data: T;
}
export class Response<T> implements NestInterceptor {
  intercept(context, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          status: 0,
          message: '牛逼',
          success: true,
        };
      }),
    );
  }
}
