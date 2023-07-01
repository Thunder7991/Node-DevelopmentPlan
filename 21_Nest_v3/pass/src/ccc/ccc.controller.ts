import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnApplicationShutdown,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { CccService } from './ccc.service';
import { CreateCccDto } from './dto/create-ccc.dto';
import { UpdateCccDto } from './dto/update-ccc.dto';

@Controller('ccc')
export class CccController
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    OnApplicationShutdown,
    BeforeApplicationShutdown
{
  constructor(private readonly cccService: CccService) {}
  onModuleInit() {
    console.log('CccController OnModuleInit');
  }
  onApplicationBootstrap() {
    console.log('CccController onApplicationBootstrap');
  }
  onModuleDestroy() {
    console.log('Cccontroller onModuleDestroy');
  }
  onApplicationShutdown(signal?: string) {
    console.log('Cccontroller onApplicationShutdown' + signal);
  }
  beforeApplicationShutdown(signal?: string) {
    console.log('Cccontroller beforeApplicationShutdown' + signal);
  }
  @Post()
  create(@Body() createCccDto: CreateCccDto) {
    return this.cccService.create(createCccDto);
  }

  @Get()
  findAll() {
    return this.cccService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cccService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCccDto: UpdateCccDto) {
    return this.cccService.update(+id, updateCccDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cccService.remove(+id);
  }
}
