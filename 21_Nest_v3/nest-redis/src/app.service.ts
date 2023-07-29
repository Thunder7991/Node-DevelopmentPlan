import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class AppService {
  //第二步注入服务
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  async getHello() {
    const value = await this.redisClient.keys('*');
    console.log(value);

    return 'hello world';
  }
}
