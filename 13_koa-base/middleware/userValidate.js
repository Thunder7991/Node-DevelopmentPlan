const Joi = require('joi');
const { User } = require('../model/index');
exports.registerValidate = async (ctx, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()
  }).validate(ctx.request.body);
  if (schema.error) {
    //抛出错误
    ctx.throw(400, schema.error);
  }
  //验证生数据是否包含
  const emailValidate = await User.findOne({ email: ctx.request.body.eamil });

  if (emailValidate) {
    ctx.throw(400, '邮箱已经被注册');
  }
  await next();
};
//用户登录演这个
exports.loginValidate = async (ctx, next) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  }).validate(ctx.request.body);
  if (schema.error) {
    //抛出错误
    ctx.throw(400, schema.error);
  }
  //验证生数据是否包含
  const emailValidate = await User.findOne({ email: ctx.request.body.email });

  if (!emailValidate) {
    ctx.throw(400, '邮箱未注册');
  }
  await next();
};
