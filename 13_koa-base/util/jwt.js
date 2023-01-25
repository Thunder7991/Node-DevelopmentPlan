const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const { uuid } = require('../config/config.default');

//required : 验证token
module.exports.verifyToken = function (required = true) {
  return async (ctx, next) => {
    //获取头信息
    let token = ctx.header.authorization;

    token = token ? token.split('Bearer ')[1] : null;

    if (token) {
      try {
        let userInfo = await verify(token, uuid);
        //用户信息
        ctx.user = userInfo;
      } catch (error) {
        ctx.throw(402, error);
      }
    } else if (!required) {
      await next();
    } else {
      ctx.throw(402, '请传入token!');
    }
    await next();
  };
};
//生成token
module.exports.createToken = async (userInfo) => {
  const token = await tojwt({ userInfo }, uuid, { expiresIn: 60 * 60 * 24 });
  return token;
};
