import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { AaaModule } from './aaa/aaa.module';
import { Inject } from '@nestjs/common/decorators';
import { CronJob } from 'cron';

@Module({
  //引入定时任务包
  imports: [ScheduleModule.forRoot(), AaaModule],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
//对定时任务进行增删改
export class AppModule implements OnApplicationBootstrap {
  @Inject(SchedulerRegistry)
  private schedulerRegistry: SchedulerRegistry;

  onApplicationBootstrap() {
    //获取所有的定时任务 Map
    // this.schedulerRegistry.getCronJobs();

    // this.schedulerRegistry.getCronJob('task1');
    // const intervalJob = this.schedulerRegistry.getInterval('task2');
    // this.schedulerRegistry.getTimeouts();

    // this.schedulerRegistry.getTimeout('task3');
    // console.log(intervalJob);

    const crons = this.schedulerRegistry.getCronJobs();

    //停止定时任务
    crons.forEach((item, key) => {
      item.stop();
      this.schedulerRegistry.deleteCronJob(key);
    });

    const intervals = this.schedulerRegistry.getIntervals();
    intervals.forEach((item) => {
      const interval = this.schedulerRegistry.getInterval(item);
      clearInterval(interval);

      this.schedulerRegistry.deleteInterval(item);
    });

    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((item) => {
      const timeout = this.schedulerRegistry.getTimeout(item);
      clearTimeout(timeout);

      this.schedulerRegistry.deleteTimeout(item);
    });

    console.log(this.schedulerRegistry.getCronJobs());
    console.log(this.schedulerRegistry.getIntervals());
    console.log(this.schedulerRegistry.getTimeouts());

    //添加定时任务

    const job = new CronJob(`0/5 * * * * *`, () => {
      console.log('cron job');
    });

    this.schedulerRegistry.addCronJob('job1', job);
    job.start();

    const interval = setInterval(() => {
      console.log('interval job');
    }, 3000);
    this.schedulerRegistry.addInterval('job2', interval);

    const timeout = setTimeout(() => {
      console.log('timeout job');
    }, 5000);
    this.schedulerRegistry.addTimeout('job3', timeout);
  }
}
