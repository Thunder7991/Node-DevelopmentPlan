import { Injectable } from '@nestjs/common';
import { CreateTestloggermoduleDto } from './dto/create-testloggermodule.dto';
import { UpdateTestloggermoduleDto } from './dto/update-testloggermodule.dto';

@Injectable()
export class TestloggermoduleService {
  create(createTestloggermoduleDto: CreateTestloggermoduleDto) {
    return 'This action adds a new testloggermodule';
  }

  findAll() {
    return `This action returns all testloggermodule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testloggermodule`;
  }

  update(id: number, updateTestloggermoduleDto: UpdateTestloggermoduleDto) {
    return `This action updates a #${id} testloggermodule`;
  }

  remove(id: number) {
    return `This action removes a #${id} testloggermodule`;
  }
}
