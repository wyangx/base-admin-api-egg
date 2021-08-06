'use strict';

const HttpException = require('../exception/http');

module.exports = () => {
  return async function errorHandler(ctx, next) {
    const method = ctx.request.method;
    if (method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
    try {
      await next();
    } catch (err) {
      if (err instanceof HttpException) {
        ctx.status = err.httpCode;
        ctx.body = {
          code: err.code,
          msg: err.msg,
          data: err.data,
        };
        return;
      }
      if (err.status === 422) {
        let message = err.errors[0].message;
        if (err.errors[0].code === 'missing_field') {
          message = '参数中缺少' + err.errors[0].field;
        }
        ctx.status = 409;
        ctx.body = {
          code: 40009,
          msg: message,
          data: null,
        };
        return;
      }
      ctx.status = 500;
      ctx.body = {
        code: 50000,
        msg: err.message || '服务器异常',
        data: null,
      };
    }
  };
};
