'use strict';

const HttpException = require('./http');
class ParamsException extends HttpException {
  constructor(message = '表单参数校验失败', errCode = 40009) {
    super(errCode, message, null, 409);
  }
}

module.exports = ParamsException;
