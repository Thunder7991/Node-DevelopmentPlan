/*
 * @Author: thunderchen
 * @Date: 2023-06-18 22:09:48
 * @LastEditTime: 2023-06-18 22:09:57
 * @email: 853524319@qq.com
 * @Description:
 */

// feishu-auth.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-custom';
import { FastifyRequest } from 'fastify';

@Injectable()
export class FeishuStrategy extends PassportStrategy(Strategy, 'feishu') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: FastifyRequest): Promise<Payload> {
    const q: any = req.query;

    const user = await this.authService.validateFeishuUser(q.code as string);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
