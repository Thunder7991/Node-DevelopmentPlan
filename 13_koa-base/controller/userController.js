/*
 * @Author: thunderchen
 * @Date: 2023-01-14 22:43:53
 * @LastEditTime: 2023-01-15 23:27:04
 * @email: 853524319@qq.com
 * @Description: "控制器"
 */

const { User } = require("../model") 
//用户注册
//用户注册
module.exports.register = async (ctx) => {
    const userModel = new User(ctx.request.body);
    const dbBack = await userModel.save();
    user = dbBack.toJSON();
    delete user.password;
    // res.status(201).json({ user });
    ctx.status = 201
    ctx.body = user
  };
exports.index = async (ctx, next) => {
    var user = await User.findById(ctx.params.userId)
    ctx.body = user
  }