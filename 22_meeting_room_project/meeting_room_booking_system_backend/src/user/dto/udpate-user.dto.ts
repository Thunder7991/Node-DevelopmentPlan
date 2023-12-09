/*
 * @Author: thunderchen
 * @Date: 2023-12-09 15:24:00
 * @LastEditTime: 2023-12-09 15:26:25
 * @email: 853524319@qq.com
 * @Description: 修改个人信息
 */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  headPic: string;

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
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
