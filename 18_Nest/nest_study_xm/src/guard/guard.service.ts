import { Injectable } from '@nestjs/common';
import { CreateGuardDto } from './dto/create-guard.dto';
import { UpdateGuardDto } from './dto/update-guard.dto';

@Injectable()
export class GuardService {
  create(createGuardDto: CreateGuardDto) {
    return 'This action adds a new guard';
  }

  findAll() {
    return `This action returns all guard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} guard`;
  }

  update(id: number, updateGuardDto: UpdateGuardDto) {
    return `This action updates a #${id} guard`;
  }

  remove(id: number) {
    return `This action removes a #${id} guard`;
  }
}
