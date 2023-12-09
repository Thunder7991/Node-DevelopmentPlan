/*
 * @Author: thunderchen
 * @Date: 2023-12-09 14:41:36
 * @LastEditTime: 2023-12-09 14:44:51
 * @email: 853524319@qq.com
 * @Description: 密码 邮箱 验证码 校验
 */

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  password: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
