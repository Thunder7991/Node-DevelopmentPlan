const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const { ctx, service } = this;
    ctx.validate({
      username: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    });

    // 获取用户传入的数据
    const userBody = ctx.request.body;
    const hasEmail = await service.user.findEmail(userBody.email);
    if (hasEmail) {
      ctx.throw(422, '邮箱已经存在!');
    }
    const user = await service.user.createUser(userBody);

    ctx.body = user;
  }
  async login() {
    const userBody = this.ctx.request.body;
    this.ctx.validate(
      {
        email: { type: 'email', required: true, convertType: 'string' },
        password: {
          type: 'string',
        },
      },
      userBody
    );
    console.log(userBody);
    const user = await this.service.user.findEmail(userBody);
    console.log(41, user);

    if (!user) {
      this.ctx.throw(422, '用户未注册!');
    }

    if (this.ctx.helper.md5(userBody.password) !== user.password) {
      this.ctx.throw(422, '密码不正确!');
    }

    const token = this.service.user.createToken({ user });
    const userinfo = user._doc;
    delete userinfo.password;
    this.ctx.body = {
      ...userinfo,
      token,
    };
  }
}

module.exports = UserController;
