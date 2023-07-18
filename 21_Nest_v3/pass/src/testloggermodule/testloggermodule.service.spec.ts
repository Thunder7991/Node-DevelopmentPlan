import { Test, TestingModule } from '@nestjs/testing';
import { TestloggermoduleService } from './testloggermodule.service';

describe('TestloggermoduleService', () => {
  let service: TestloggermoduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestloggermoduleService],
    }).compile();

    service = module.get<TestloggermoduleService>(TestloggermoduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
