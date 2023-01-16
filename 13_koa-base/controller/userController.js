/*
 * @Author: thunderchen
 * @Date: 2023-01-14 22:43:53
 * @LastEditTime: 2023-01-16 22:13:38
 * @email: 853524319@qq.com
 * @Description: "控制器"
 */

const { User } = require('../model');
const { createToken } = require('../util/jwt');

//用户注册
//用户注册
module.exports.register = async (ctx) => {
  const userModel = new User(ctx.request.body);
  const dbBack = await userModel.save();
  user = dbBack.toJSON();
  delete user.password;
  // res.status(201).json({ user });
  ctx.status = 201;
  ctx.body = user;
};
exports.index = async (ctx, next) => {
  var user = await User.findById(ctx.params.userId);
  ctx.body = user;
};
//用户登录
module.exports.login = async (ctx) => {
  let dbBack = await User.findOne(ctx.request.body);
  if (!dbBack) {
    return ctx.throw(402, '邮箱或者密码不正确!');
  }

  dbBack = dbBack.toJSON();
  dbBack.token = await createToken(dbBack);
  ctx.body = dbBack.token;
};

//获取用户信息
module.exports.getuser = async (ctx) => {
  ctx.body = ctx.user;
};
