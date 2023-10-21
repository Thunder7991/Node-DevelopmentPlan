import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Article } from './article/entities/article.entity';

@Controller()
export class AppController {
  @InjectEntityManager()
  private entityManager: EntityManager;

  constructor(private readonly appService: AppService) {}



  @Get('init-data')
  async initData() {
    await this.entityManager.save(User, {
      username: 'thunderchen',
      password: '123456',
    });

    await this.entityManager.save(User, {
      username: 'clearlove',
      password: '123456',
    });

    await this.entityManager.save(Article, {
      title: 'Hello World',
      content: 'Hello World',
    });

    await this.entityManager.save(Article, {
      title: 'thunderchen',
      content: `thunderchen`,
    });

    return 'done';
  }
}
