import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { AaaService } from './aaa/aaa.service';

@Injectable()
export class TaskService {
  @Inject(AaaService)
  private aaaService: AaaService;

  //三种定时任务
  //   @Cron(CronExpression.EVERY_5_SECONDS, {
  //     name: 'task1',
  //     timeZone: 'Asia/Shanghai',
  //   })
  //   handlerCrom() {
  //     console.log('task execute：', this.aaaService.findAll());
  //   }

  //   @Interval('task2', 3000)
  //   task2() {
  //     console.log('task2');
  //   }
  //   @Timeout('task3', 2000)
  //   task3() {
  //     console.log('task3');
  //   }
}
