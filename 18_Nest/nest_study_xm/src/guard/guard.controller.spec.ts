import { Test, TestingModule } from '@nestjs/testing';
import { GuardController } from './guard.controller';
import { GuardService } from './guard.service';

describe('GuardController', () => {
  let controller: GuardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardController],
      providers: [GuardService],
    }).compile();

    controller = module.get<GuardController>(GuardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
