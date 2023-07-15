import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpException,
  ParseFloatPipe,
  ParseArrayPipe,
  ParseEnumPipe,
  ParseUUIDPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TestPipeService } from './test-pipe.service';
import { CreateTestPipeDto } from './dto/create-test-pipe.dto';
import { UpdateTestPipeDto } from './dto/update-test-pipe.dto';
import { CustomPipePipe } from 'src/custom-pipe/custom-pipe.pipe';

enum Ggg {
  Aaa = '111',
  Bbb = '222',
  Ccc = '333',
}

@Controller('test-pipe')
export class TestPipeController {
  constructor(private readonly testPipeService: TestPipeService) {}

  @Post()
  create(@Body() createTestPipeDto: CreateTestPipeDto) {
    return this.testPipeService.create(createTestPipeDto);
  }
  // @Get('/:aa')
  @Get('/:uuid')

  // findAll(@Query('aa', ParseIntPipe) aa: string) {
  // findAll(@Query('aa', ParseFloatPipe) aa: string) {
  // findAll(
  //   @Query(
  //     'aa',
  //     new ParseArrayPipe({
  //       items: Number, //类型
  //       separator: '..', //http://localhost:3000/test-pipe?aa=1..2..3
  //       optional: true, //没有传参数的时候会报错
  //     }),
  //   )
  //   aa: Array<number>,
  // ) {
  //枚举
  // findAll(
  //   @Param(
  //     'aa',
  //     new ParseEnumPipe(Ggg, {
  //       errorHttpStatusCode: 404,
  //       exceptionFactory: (msg) => {
  //         throw new HttpException('xxx' + msg, HttpStatus.NOT_FOUND);
  //       },
  //     }),
  //   )
  //   aa: Ggg,
  // ) {

  //UUID
  // findAll(
  //   @Param('uuid', new ParseUUIDPipe())
  //   uuid: string,
  // ) {

  // 设置参数默认值
  findAll(
    @Query('kkk', new DefaultValuePipe('aaa'))
    kkk: string,
  ) {
    //修改的 修改返回的响应
    // findAll(@Query('aa', new ParseIntPipe({
    //   errorHttpStatusCode:HttpStatus.NOT_FOUND
    // })) aa: string) {
    //自己抛一个异常出来，然后让 exception filter 处理：
    // findAll(
    //   @Query(
    //     'aa',
    //     new ParseIntPipe({
    //       exceptionFactory: (msg) => {
    //         console.log(msg);
    //         throw new HttpException('xxx' + msg, HttpStatus.NOT_FOUND);
    //       },
    //     }),
    //   )
    //   aa: string,
    // ) {
    // return this.testPipeService.findAll();
    // return aa + 1;
    // console.log(aa);

    // return aa.reduce((total, item) => total + item, 0);
    console.log(kkk);

    return kkk;
  }

  @Get('pipe/:id')
  findOne(@Param('id', CustomPipePipe) id: string) {
    return this.testPipeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestPipeDto: UpdateTestPipeDto,
  ) {
    return this.testPipeService.update(+id, updateTestPipeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testPipeService.remove(+id);
  }
}
