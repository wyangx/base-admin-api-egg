/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1619602705253_1169';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
    allowHeaders: '*',
  };

  config.validate = {
    convert: true,
    validateRoot: false,
  };

  config.jwt = {
    expire: 7200,
    secret: 'b2ce49e4a541068d',
    refresh_expire: 259200,
    refresh_secret: 'b2ce49e4a541068c',
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };
  config.sequelize = {
    timezone: '+08:00',
    dialect: 'mysql',
    host: 'localhost',
    port: '3306',
    database: 'base-admin',
    username: 'root',
    password: 'lovetcty',
  };
  config.multipart = {
    mode: 'file',
    tmpdir: path.join(__dirname, '..', 'tmp', appInfo.name),
    whitelist: [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.dmg',
    ],
    fileSize: '20mb',
  };

  config.onerror = {
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    file: {
      disk: '/Users/menglingyue/Documents/www/my/java/upload',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
