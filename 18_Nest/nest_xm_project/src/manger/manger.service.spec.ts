import { Test, TestingModule } from '@nestjs/testing';
import { MangerService } from './manger.service';

describe('MangerService', () => {
  let service: MangerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MangerService],
    }).compile();

    service = module.get<MangerService>(MangerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
