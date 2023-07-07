import {
  SetMetadata,
  applyDecorators,
  Get,
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  Controller,
} from '@nestjs/common';
import { GuardGuard } from 'src/guard/guard.guard';
import { Request } from 'express';

export const Decorator = (...args: string[]) => SetMetadata('decorator', args);

export function Fff(path, role) {
  return applyDecorators(Get(path), Decorator(role), UseGuards(GuardGuard));
}

//参数装饰器
export const Ggg = createParamDecorator(
  //data 很明显就是传入的参数，而 ExecutionContext 前面用过，可以取出 request、response 对象。
  (data: string, ctx: ExecutionContext) => {
    return 'ccc';
  },
);

//自定义header装饰器
export const MyHeaders = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return key ? request.headers[key] : request.headers;
  },
);

//@Query
export const MyQuery = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.query[key];
  },
);

//自定义Class装饰器
export const Hhh = () => Controller('hhh');

//组合多个装饰器
export const Iii = (path, metadata) => {
  return applyDecorators(Controller(path), SetMetadata('iii', metadata));
};
