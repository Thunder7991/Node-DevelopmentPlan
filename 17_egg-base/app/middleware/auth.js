module.exports = (required = true) => {
  return async (ctx, next) => {
    // 获取头信息
    let token = ctx.header.authorization;

    token = token ? token.split('Bearer ')[1] : null;

    if (token) {
      try {
        const data = ctx.service.user.verifyToken(token);
        // 用户信息
        ctx.user = data.user;
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
