'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const auth = app.middleware.auth;
  // router.get('/', controller.home.index);
  // 添加前缀
  router.prefix('/api/v1');
  // 用户频道
  router.post('/users', controller.user.create);
  // 用户登录
  router.post('/users/login', controller.user.login);
  // 获取频道详情
  router.get('/users/info/:userid', auth(true), controller.user.userInfo);
  // 关注频道
  router.get('/users/subscribe/:subscribeid', auth(true), controller.user.subscribe);

};
