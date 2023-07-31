import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Observable, async } from 'rxjs';
import { UserService } from './user.service';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(Reflector)
  private reflector: Reflector;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('用户未登录');
    }
    const token = bearer[1];

    const info = this.jwtService.verify(token);

    const foundUser = await this.userService.findByUsername(info.user.username);
    console.log(37, context.getHandler());
    const permission = this.reflector.get('permission', context.getHandler());
    if (foundUser.permissions.some((item) => item.name === permission)) {
      return true;
    } else {
      console.log(42);

      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
