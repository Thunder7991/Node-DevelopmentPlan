/*
 * @Author: thunderchen
 * @Date: 2023-12-09 14:35:42
 * @LastEditTime: 2023-12-09 14:36:54
 * @email: 853524319@qq.com
 * @Description: 用户信息(剔除密码)
 */

export class UserDetailVo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  headPic: string;

  phoneNumber: string;

  isFrozen: boolean;

  createTime: Date;
}
