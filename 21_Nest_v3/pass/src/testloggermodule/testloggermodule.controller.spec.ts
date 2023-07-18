import { Test, TestingModule } from '@nestjs/testing';
import { TestloggermoduleController } from './testloggermodule.controller';
import { TestloggermoduleService } from './testloggermodule.service';

describe('TestloggermoduleController', () => {
  let controller: TestloggermoduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestloggermoduleController],
      providers: [TestloggermoduleService],
    }).compile();

    controller = module.get<TestloggermoduleController>(
      TestloggermoduleController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
