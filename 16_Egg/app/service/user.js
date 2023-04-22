/*
 * @Author: thunderchen
 * @Date: 2023-01-23 19:52:36
 * @LastEditTime: 2023-01-23 20:27:08
 * @email: 853524319@qq.com
 * @Description: 业务逻辑
 */

const Service = require('egg').Service;

class UserService extends Service {
  getUserList() {
    return [{
      id: 0,
      username: 'thunderchen',
    }];
  }
}

module.exports = UserService;
