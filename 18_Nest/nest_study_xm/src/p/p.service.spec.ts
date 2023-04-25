import { Test, TestingModule } from '@nestjs/testing';
import { PService } from './p.service';

describe('PService', () => {
  let service: PService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PService],
    }).compile();

    service = module.get<PService>(PService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
