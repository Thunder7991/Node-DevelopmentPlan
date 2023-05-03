import { Injectable } from '@nestjs/common';
import { CreateMysqlDto } from './dto/create-mysql.dto';
import { UpdateMysqlDto } from './dto/update-mysql.dto';

@Injectable()
export class MysqlService {
  create(createMysqlDto: CreateMysqlDto) {
    return 'This action adds a new mysql';
  }

  findAll() {
    return `This action returns all mysql`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mysql`;
  }

  update(id: number, updateMysqlDto: UpdateMysqlDto) {
    return `This action updates a #${id} mysql`;
  }

  remove(id: number) {
    return `This action removes a #${id} mysql`;
  }
}
