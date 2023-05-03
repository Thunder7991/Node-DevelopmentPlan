import { Test, TestingModule } from '@nestjs/testing';
import { GuardService } from './guard.service';

describe('GuardService', () => {
  let service: GuardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardService],
    }).compile();

    service = module.get<GuardService>(GuardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
