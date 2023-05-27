import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MangerService } from './manger.service';
import { CreateMangerDto } from './dto/create-manger.dto';
import { UpdateMangerDto } from './dto/update-manger.dto';

@Controller('manger')
export class MangerController {
  constructor(private readonly mangerService: MangerService) {}

  @Post()
  create(@Body() createMangerDto: CreateMangerDto) {
    return this.mangerService.create(createMangerDto);
  }
  @Post('/transferMoney')
  transferMoney(@Body() transferMoneyDto: transferMoneyDto) {
    return this.mangerService.transferMoney(transferMoneyDto);
  }

  @Get()
  findAll() {
    return this.mangerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mangerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMangerDto: UpdateMangerDto) {
    return this.mangerService.update(+id, updateMangerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mangerService.remove(+id);
  }
}
