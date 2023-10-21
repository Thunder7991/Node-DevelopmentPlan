import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Article } from './entities/article.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  @Inject(RedisService)
  private redisService: RedisService;

  async findOne(id: number) {
    return await this.entityManager.findOneBy(Article, {
      id,
    });
  }

  async view(id: number, userId: string) {
    //查询 redis，如果没查到就从数据库里查出来返回，并存到 redis 里。
    const res = await this.redisService.hashGet(`article_${id}`);
    if (res.viewCount === undefined) {
      const article = await this.findOne(id);

      article.viewCount++;

      await this.entityManager.update(
        Article,
        { id },
        {
          viewCount: article.viewCount,
        },
      );

      await this.redisService.hashSet(`article_${id}`, {
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        collectCount: article.collectCount,
      });
      //设置用户访问标志 (3秒)
      await this.redisService.set(`user_${userId}_article_${id}`, 1, 3);
      return article.viewCount;
    } else {
      const flag = await this.redisService.get(`user_${userId}_article_${id}`);
      if (flag) {
        return res.viewCount;
      }
      await this.redisService.hashSet(`article_${id}`, {
        ...res,
        viewCount: +res.viewCount + 1,
      });
       //设置用户访问标志 (3秒)
       await this.redisService.set(`user_${userId}_article_${id}`, 1, 3);
      return +res.viewCount + 1;
    }
  }

  //同步数据库
  async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const res = await this.redisService.hashGet(key);

      const [, id] = key.split('_');

      await this.entityManager.update(
        Article,
        {
          id: +id,
        },
        {
          viewCount: +res.viewCount,
        },
      );
    }
  }
}
