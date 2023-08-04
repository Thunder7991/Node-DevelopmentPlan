import { Injectable } from '@nestjs/common';
import { CreateDcDto } from './dto/create-dc.dto';
import { UpdateDcDto } from './dto/update-dc.dto';

@Injectable()
export class DcService {
  create(createDcDto: CreateDcDto) {
    return 'This action adds a new dc';
  }

  findAll() {
    return `This action returns all dc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dc`;
  }

  update(id: number, updateDcDto: UpdateDcDto) {
    return `This action updates a #${id} dc`;
  }

  remove(id: number) {
    return `This action removes a #${id} dc`;
  }
}
