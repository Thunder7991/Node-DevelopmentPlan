import { Test, TestingModule } from '@nestjs/testing';
import { PController } from './p.controller';
import { PService } from './p.service';

describe('PController', () => {
  let controller: PController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PController],
      providers: [PService],
    }).compile();

    controller = module.get<PController>(PController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
