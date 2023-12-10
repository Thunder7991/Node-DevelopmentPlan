/*
 * @Author: thunderchen
 * @Date: 2023-12-09 15:24:00
 * @LastEditTime: 2023-12-09 16:11:06
 * @email: 853524319@qq.com
 * @Description: 修改个人信息
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  headPic: string;

  @ApiProperty()
  nickName: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty()
  captcha: string;
}
