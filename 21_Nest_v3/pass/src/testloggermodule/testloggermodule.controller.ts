import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { TestloggermoduleService } from './testloggermodule.service';
import { CreateTestloggermoduleDto } from './dto/create-testloggermodule.dto';
import { UpdateTestloggermoduleDto } from './dto/update-testloggermodule.dto';
import { MyLogger2 } from 'src/customLogger/MyLogger';

@Controller('testloggermodule')
export class TestloggermoduleController {
  constructor(
    private readonly testloggermoduleService: TestloggermoduleService,
    // 这个模块里可以直接注入 MyLogger2，不用 imports 那个 Module。
    @Inject(MyLogger2) private logger: MyLogger2,
  ) {}

  @Post()
  create(@Body() createTestloggermoduleDto: CreateTestloggermoduleDto) {
    return this.testloggermoduleService.create(createTestloggermoduleDto);
  }
  @Get()
  findAll() {
    this.logger.log('xxx', TestloggermoduleController.name);
    return this.testloggermoduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testloggermoduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestloggermoduleDto: UpdateTestloggermoduleDto,
  ) {
    return this.testloggermoduleService.update(+id, updateTestloggermoduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testloggermoduleService.remove(+id);
  }
}
