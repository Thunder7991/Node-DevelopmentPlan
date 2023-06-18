import {
  Body,
  Controller,
  Post,
  VERSION_NEUTRAL,
  Version,
} from '@nestjs/common';
import { FsService } from './fs.service';
import { FsMessageDto, GetUserTokenDto } from './fs.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('fs')
@Controller('fs')
export class FsController {
  constructor(private readonly fsService: FsService) {}
  @ApiOperation({
    summary: '消息推送',
  })
  @Version([VERSION_NEUTRAL])
  @Post('sendMessage')
  sendMessage(@Body() params: FsMessageDto) {
    const { receive_id_type, ...rest } = params;
    console.log(22, params);
    return this.fsService.sendMessage(receive_id_type, rest);
  }

  @ApiOperation({
    summary: '获取用户凭证',
  })
  @Post('getUserToken')
  getUserToken(@Body() params: GetUserTokenDto) {
    const { code } = params;
    return this.fsService.getUserToken(code);
  }
}
