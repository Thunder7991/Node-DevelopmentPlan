import { Test, TestingModule } from '@nestjs/testing';
import { DynamicModuleController } from './dynamic-module.controller';
import { DynamicModuleService } from './dynamic-module.service';

describe('DynamicModuleController', () => {
  let controller: DynamicModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicModuleController],
      providers: [DynamicModuleService],
    }).compile();

    controller = module.get<DynamicModuleController>(DynamicModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
