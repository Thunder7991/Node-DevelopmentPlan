import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MysqlService } from './mysql.service';
import { CreateMysqlDto } from './dto/create-mysql.dto';
import { UpdateMysqlDto } from './dto/update-mysql.dto';

@Controller('mysql')
export class MysqlController {
  constructor(private readonly mysqlService: MysqlService) {}

  @Post()
  create(@Body() createMysqlDto: CreateMysqlDto) {
    return this.mysqlService.create(createMysqlDto);
  }

  @Get()
  findAll() {
    return this.mysqlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mysqlService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMysqlDto: UpdateMysqlDto) {
    return this.mysqlService.update(+id, updateMysqlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mysqlService.remove(+id);
  }
}
