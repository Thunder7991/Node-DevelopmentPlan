import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class GuardGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(17, context.getHandler());

    console.log(19, this.reflector.get('decorator', context.getHandler()));

    console.log(21, this.reflector.get('iii', context.getClass()));

    return true;
  }
}
