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
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('用户未登录');
    }

    const token = bearer[1];

    const info = this.jwtService.verify(token);
    let permissions = await this.redisService.listGet(
      `user_${info.user.username}_permissions`,
    );

    if (!permissions) {
      const foundUser = await this.userService.findByUsername(
        info.user.username,
      );
      permissions = foundUser.permissions.map((item) => item.name);
      this.redisService.listSet(
        `user_${info.user.username}_permissions`,
        permissions,
        60 * 30,
      );
    }
    const permission = this.reflector.get('permission', context.getHandler());
    if (permissions.some((item) => item === permission)) {
      return true;
    } else {
      console.log(42);

      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
