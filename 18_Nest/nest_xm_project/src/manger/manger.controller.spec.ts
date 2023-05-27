import { Test, TestingModule } from '@nestjs/testing';
import { MangerController } from './manger.controller';
import { MangerService } from './manger.service';

describe('MangerController', () => {
  let controller: MangerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MangerController],
      providers: [MangerService],
    }).compile();

    controller = module.get<MangerController>(MangerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
