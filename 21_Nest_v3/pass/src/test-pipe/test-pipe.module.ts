import { Module } from '@nestjs/common';
import { TestPipeService } from './test-pipe.service';
import { TestPipeController } from './test-pipe.controller';
import { CustomPipePipe } from 'src/custom-pipe/custom-pipe.pipe';
import { APP_PIPE } from '@nestjs/core';

@Module({
  controllers: [TestPipeController],
  providers: [
    TestPipeService,
    // {
    //   provide: APP_PIPE,
    //   useClass: CustomPipePipe,
    // },
    // {
    //   //全局注入
    //   provide: 'validation_options',
    //   useFactory() {
    //     return {
    //       aaa: 1,
    //       bbb: 2,
    //     };
    //   },
    // },
  ],
})
export class TestPipeModule {}
