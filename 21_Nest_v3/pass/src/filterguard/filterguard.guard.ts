import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ArgumentsHost,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/role/role';

@Injectable()
export class FilterguardGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // ExecutionContext 是 ArgumentsHost的子类

    const requiredRoles = this.reflector.get<Role[]>(
      'role',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const { query } = context.switchToHttp().getRequest();
    console.log(requiredRoles);

    return requiredRoles.some(
      (role) => query?.user && query.user?.includes(role),
    );
  }
}
