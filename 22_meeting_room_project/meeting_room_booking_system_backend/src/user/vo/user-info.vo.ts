/*
 * @Author: thunderchen
 * @Date: 2023-12-09 14:35:42
 * @LastEditTime: 2023-12-10 22:02:02
 * @email: 853524319@qq.com
 * @Description: 用户信息(剔除密码)
 */

import { ApiProperty } from '@nestjs/swagger';

export class UserDetailVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  headPic: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  createTime: Date;
}
