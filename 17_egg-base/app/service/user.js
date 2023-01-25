const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
class UserService extends Service {
  get User() {
    return this.app.model.User;
  }
  createToken(data) {
    return jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn,
    });
  }
  findEmail(body) {
    return this.User.findOne(body).select('+password');// 查询的时候添加上密码
  }
  // 验证token
  verifyToken(token) {
    return jwt.verify(token, this.app.config.jwt.secret);
  }
  // 创建用户
  async createUser(data) {
    data.password = this.ctx.helper.md5(data.password);
    const user = new this.User(data);
    await user.save();
    return user;
  }
}

module.exports = UserService;
