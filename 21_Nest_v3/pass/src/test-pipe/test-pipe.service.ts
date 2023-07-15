import { Injectable } from '@nestjs/common';
import { CreateTestPipeDto } from './dto/create-test-pipe.dto';
import { UpdateTestPipeDto } from './dto/update-test-pipe.dto';

@Injectable()
export class TestPipeService {
  create(createTestPipeDto: CreateTestPipeDto) {
    return 'This action adds a new testPipe';
  }

  findAll() {
    return `This action returns all testPipe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testPipe`;
  }

  update(id: number, updateTestPipeDto: UpdateTestPipeDto) {
    return `This action updates a #${id} testPipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} testPipe`;
  }
}
