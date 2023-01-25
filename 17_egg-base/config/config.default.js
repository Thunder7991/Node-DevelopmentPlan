/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1674478514793_3560';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];
  config.errorHandler = {
    match: '/api',
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mongoose = {
    client: {
      url: 'mongodb://192.168.148.128:27017/express-video',
      options: {},
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [],
    },
  };
  // 关闭csrf认证
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.jwt = {
    secret: '4a380a09-3aab-401b-a620-1372b7e8c77a',
    expiresIn: '1d',
  };
  return {
    ...config,
    ...userConfig,
  };
};
