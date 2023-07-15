import { Module } from '@nestjs/common';
import { TestPipeService } from './test-pipe.service';
import { TestPipeController } from './test-pipe.controller';

@Module({
  controllers: [TestPipeController],
  providers: [TestPipeService],
})
export class TestPipeModule {}
