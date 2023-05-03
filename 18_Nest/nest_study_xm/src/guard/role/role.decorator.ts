import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
  applyDecorators,
} from '@nestjs/common';
import { Request } from 'express';

export const Role = (...args: string[]) => SetMetadata('role', args);
//参数装饰器
export const ReqUrl = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log(data);
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.url;
    // 组合装饰器
    // return applyDecorators(Role,xxx,xxx)
  },
);
