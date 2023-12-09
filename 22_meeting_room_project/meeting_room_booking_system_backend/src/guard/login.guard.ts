import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Permission } from 'src/user/entities/permission.entity';
import { UnLoginException } from 'src/unlogin.filter';

// 其实现在 controller 里有很多重复代码，比如多次生成 jwt 的代码，这个大家可以自己重构下，抽一个方法出来。

// 判断用户是否需要登录/是否可以访问

interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}
@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    //获取元数据 , 从目标 controller 和 handler 上拿到 require-login 的 metadata。
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
      // throw new UnLoginException()
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions,
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
      // throw new UnLoginException()
    }
  }
}
