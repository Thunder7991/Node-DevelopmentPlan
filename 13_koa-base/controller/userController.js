/*
 * @Author: thunderchen
 * @Date: 2023-01-14 22:43:53
 * @LastEditTime: 2023-01-21 23:25:28
 * @email: 853524319@qq.com
 * @Description: "控制器"
 */

const { User, Subscribe } = require('../model');
const { createToken } = require('../util/jwt');

//用户注册
//用户注册
exports.register = async (ctx) => {
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
exports.login = async (ctx) => {
  let dbBack = await User.findOne(ctx.request.body);
  if (!dbBack) {
    return ctx.throw(402, '邮箱或者密码不正确!');
  }

  dbBack = dbBack.toJSON();
  dbBack.token = await createToken(dbBack);
  ctx.body = dbBack;
};

//获取用户信息
exports.getuser = async (ctx) => {
  console.log(ctx.request.params);
  const userid = ctx.request.params.userid;

  //获取应经登录的信息
  const registerUserId = ctx.user ? ctx.user.userinfo._id : null;
  let isSubscribe = false;
  if (registerUserId) {
    //是否订阅
    const subscribe = await Subscribe.findOne({
      user: registerUserId, //用户id
      channel: userid,
    });

    if (subscribe) {
      isSubscribe = true;
    }
  }
  //获取用户信息 同时获取想要的字段
  let userInfoDb = await User.findById(userid, [
    '_id',
    'username',
    'phone',
    'image',
    'cover',
    'subscribeCount',
  ]);
  let userInfo = userInfoDb.toJSON();
  userinfo.isSubscribe = isSubscribe;

  ctx.body = userInfo;
};

//关注频道
exports.setSubscribe = async (ctx) => {
  console.log(ctx);
  const subscribeid = ctx.request.params.subscribeid;
  //获取用户信息
  const userid = ctx.user.userinfo._id;

  if (subscribeid == userid) {
    return ctx.throw(403, '不能关注自己!');
  }

  let subinfo = await Subscribe.findOne({
    user: userid,
    channel: subscribeid,
  });

  if (subinfo) {
    return ctx.throw(403, '已经关注过了');
  }
  //插入数据
  let sub = new Subscribe({
    user: userid,
    channel: subscribeid,
  });
  let subDb = await sub.save();
  if (subDb) {
    //当前用户关注者数量加1
    let subscribeUser = await User.findById(subscribeid, [
      'username',
      'image',
      'cover',
      'channeldes',
      'subscribeCount',
    ]);
    subscribeUser.subscribeCount++;
    await subscribeUser.save();
    ctx.body = subscribeUser;
  } else {
    ctx.throw(501, '关注失败,请稍后重试!');
  }
};

//关注列表
exports.subscribeList = async (ctx) => {
  //获取登录者ID
  const userid = ctx.user.userinfo._id;
  console.log(userid);
  //获取相关信息
  let subList = await Subscribe.find({
    user: userid,
  }).populate('channel', ['username', 'image', 'channeldes', 'subscribeCount']);

  ctx.body = subList
};
