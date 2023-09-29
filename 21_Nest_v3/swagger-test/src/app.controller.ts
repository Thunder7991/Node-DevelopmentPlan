import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CccDto } from './ccc.dto';
import { CccVo } from './ccc.vo';

@ApiTags('测试')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @ApiCookieAuth("cookie")
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @ApiBearerAuth("bearer")
  @ApiTags("xxx-get")
  @ApiOperation({
    summary: '测试aaa接口',
    description: '测试aaa接口描述',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String,
  })
  // 两个参数
  @ApiQuery({
    name: 'a1',
    type: String,
    description: 'a1 param',
    required: false,
    example: '1111',
  })
  @ApiQuery({
    name: 'a2',
    type: Number,
    description: 'a2 param',
    required: true,
    example: 2222,
  })
  @Get('aaa')
  aaa(@Query('a1') a1, @Query('a2') a2) {
    console.log(a1, a2);
    return 'aaa success';
  }

  @ApiOperation({
    summary: '测试 bbb接口',
    description: '测试 bbb接口描述',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'bbb 成功',
    type: String,
  })
  @ApiParam({
    name: 'id',
    description: 'ID',
    required: true,
    example: '1111',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'bbb 失败',
  })

  @Get('bbb/:id')
  bbb(@Param('id') id) {
    console.log(id);
    return 'bbb success';
  }

  @Post('ccc')
  @ApiOperation({
    summary: '测试ccc接口',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ccc 成功',
    type: CccVo,
  })
  @ApiBody({
    type: CccDto,
  })
  @Post('ccc')
  ccc(@Body('ccc') ccc: CccDto) {
    console.log(98,ccc);
    const vo = new CccVo();
    vo.aaa = 111;
    vo.bbb = 222;
    return vo;
  }
}
