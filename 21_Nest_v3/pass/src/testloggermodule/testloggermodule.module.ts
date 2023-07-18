import { Module } from '@nestjs/common';
import { TestloggermoduleService } from './testloggermodule.service';
import { TestloggermoduleController } from './testloggermodule.controller';

@Module({
  controllers: [TestloggermoduleController],
  providers: [TestloggermoduleService],
})
export class TestloggermoduleModule {}
