import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  async listGet(key: string) {
    return await this.redisClient.lRange(key, 0, -1);
  }

  async listSet(key: string, list: Array<string>, ttl?: number) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      await this.redisClient.lPush(key, item);
    }
    if (ttl) {
      //设置过期时间
      await this.redisClient.expire(key, ttl);
    }
  }
}
