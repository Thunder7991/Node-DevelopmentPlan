const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const { uuid } = require('../config/config.default');

//required : 验证token
module.exports.verifyToken = function (required = true) {
  return async (ctx, next) => {
    //获取头信息
    let token = ctx.headers.authorization;

    token = token ? token.split('Bearer ')[1] : null;
    if (token) {
      try {
        let userinfo = await verify(token, uuid);
        req.user = userinfo;
       await next();
      } catch (error) {
        res.status('402').json({ error: '无效token!' });
      }
    } else if (required) {
      res.status(402).json({ error: '请传入token' });
    } else {
   await  next();
 
    }
  };
};
//生成token
module.exports.createToken = async (userinfo) => {
  const token = await tojwt({ userinfo }, uuid, { expiresIn: 60 * 60 * 24 });
  return token;
};
