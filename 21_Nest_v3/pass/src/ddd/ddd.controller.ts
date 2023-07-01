import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DddService } from './ddd.service';
import { CreateDddDto } from './dto/create-ddd.dto';
import { UpdateDddDto } from './dto/update-ddd.dto';

@Controller('ddd')
export class DddController {
  constructor(private readonly dddService: DddService) {}

  @Post()
  create(@Body() createDddDto: CreateDddDto) {
    return this.dddService.create(createDddDto);
  }

  @Get()
  findAll() {
    return this.dddService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dddService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDddDto: UpdateDddDto) {
    return this.dddService.update(+id, updateDddDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dddService.remove(+id);
  }
}
