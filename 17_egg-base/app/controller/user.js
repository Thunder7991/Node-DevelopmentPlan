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
    const user = await this.service.user.findEmail(userBody);
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

  async userInfo() {
    // 获取登录用户的id
    const USER_ID = this.ctx.user ? this.ctx.user._id : null;
    // 获取查询用户的id
    const userid = this.ctx.params.userid;
    // 是否关注
    let isSubscribe = false;
    const { Subscribe, User } = this.app.model;
    if (USER_ID) {
      const subscribe = await Subscribe.findOne({
        user: USER_ID,
        channel: userid,
      });
      if (subscribe) {
        isSubscribe = true;
      }
    }
    // 查看用户信息
    const goalUserInfoDb = await User.findById(userid);
    const userInfo = goalUserInfoDb._doc;
    userInfo.isSubscribe = isSubscribe;
    this.ctx.body = userInfo;
  }

  // 关注频道
  async subscribe() {
    const { ctx, app } = this;
    const subscribeid = ctx.params.subscribeid;
    const userid = ctx.user._id;
    if (subscribeid === userid) {
      ctx.throw('403', '不能关注自己!');
    }
    // 查询关注

    const { SubscribeModel, User } = app.model;
    const subInfo = await SubscribeModel.findOne({
      user: userid,
      channel: subscribeid,
    });
    if (subInfo) {
      ctx.throw(401, '已经关注了');
    }
    const sub = new SubscribeModel({
      user: userid,
      channel: subscribeid,
    });
    const subDb = await sub.save();// 保存数据
    if (subDb) {
      const subUserInfo = await User.findById(subscribeid);
      subUserInfo.subscribeCount++;
      await subUserInfo.save();// 添加数据啥
      ctx.body = subUserInfo;
    } else {
      ctx.throw(401, '关注失败!');
    }

  }
}

module.exports = UserController;
