'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  console.log(controller);
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

  // 视频管理模块
  // 获取上传凭证
  router.get('/video/getvod', auth(true), controller.vod.getvod);
  // 开始上传(略)
  // 获取视频详情
  router.get('/video/getvideo/:videoid', auth(true), controller.vod.getvideo);


};
