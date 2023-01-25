'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('/', controller.home.index);
  // 添加前缀
  router.prefix('/api/v1');
  // 用户频道
  router.post('/users', controller.user.create);
  // 用户登录
  router.post('/users/login', controller.user.login);
};
