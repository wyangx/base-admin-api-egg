'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  success(data = null, msg = 'success', code = 1) {
    const { ctx } = this;
    ctx.status = 200;
    ctx.body = {
      code,
      msg,
      data,
    };
  }
}

module.exports = BaseController;
