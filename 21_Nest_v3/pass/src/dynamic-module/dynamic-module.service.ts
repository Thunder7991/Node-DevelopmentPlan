import { Injectable } from '@nestjs/common';
import { CreateDynamicModuleDto } from './dto/create-dynamic-module.dto';
import { UpdateDynamicModuleDto } from './dto/update-dynamic-module.dto';

@Injectable()
export class DynamicModuleService {
  create(createDynamicModuleDto: CreateDynamicModuleDto) {
    return 'This action adds a new dynamicModule';
  }

  findAll() {
    return `This action returns all dynamicModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dynamicModule`;
  }

  update(id: number, updateDynamicModuleDto: UpdateDynamicModuleDto) {
    return `This action updates a #${id} dynamicModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} dynamicModule`;
  }
}
