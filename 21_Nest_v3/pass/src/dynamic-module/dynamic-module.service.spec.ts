import { Test, TestingModule } from '@nestjs/testing';
import { DynamicModuleService } from './dynamic-module.service';

describe('DynamicModuleService', () => {
  let service: DynamicModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicModuleService],
    }).compile();

    service = module.get<DynamicModuleService>(DynamicModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
