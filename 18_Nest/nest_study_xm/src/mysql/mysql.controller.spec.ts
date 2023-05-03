import { Test, TestingModule } from '@nestjs/testing';
import { MysqlController } from './mysql.controller';
import { MysqlService } from './mysql.service';

describe('MysqlController', () => {
  let controller: MysqlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MysqlController],
      providers: [MysqlService],
    }).compile();

    controller = module.get<MysqlController>(MysqlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
