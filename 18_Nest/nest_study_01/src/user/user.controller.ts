import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  Request,
  HttpCode,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Version('1')
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  @Get()
  findAllReq(@Request() req) {
    return {
      code: 200,
      message: req.query.name,
    };
  }

  @Post()
  @HttpCode(200)
  createReq(@Body('name') body) {
    return {
      message: body.name,
    };
  }
  @Get('code')
  createCode(@Req() req, @Res() res) {
    const Captcha = this.userService.getCode();
    res.type('image/svg+xml');
    res.send(Captcha.data);
  }
  @Post('create')
  createUser(@Body() Body, @Session() session) {
    console.log(Body, session.code);

    return;
  }
}
