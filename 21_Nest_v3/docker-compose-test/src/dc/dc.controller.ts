import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DcService } from './dc.service';
import { CreateDcDto } from './dto/create-dc.dto';
import { UpdateDcDto } from './dto/update-dc.dto';

@Controller('dc')
export class DcController {
  constructor(private readonly dcService: DcService) {}

  @Post()
  create(@Body() createDcDto: CreateDcDto) {
    return this.dcService.create(createDcDto);
  }

  @Get()
  findAll() {
    return this.dcService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dcService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDcDto: UpdateDcDto) {
    return this.dcService.update(+id, updateDcDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dcService.remove(+id);
  }
}
