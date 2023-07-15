import { Test, TestingModule } from '@nestjs/testing';
import { TestPipeService } from './test-pipe.service';

describe('TestPipeService', () => {
  let service: TestPipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestPipeService],
    }).compile();

    service = module.get<TestPipeService>(TestPipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
