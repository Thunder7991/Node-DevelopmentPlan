import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class MdGuardGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('guard');
    const role = this.reflector.get('rolesArr', context.getHandler());
    const roleClass = this.reflector.get('rolesArr', context.getClass());

    console.log(role);
    console.log(roleClass);

    return true;
  }
}
