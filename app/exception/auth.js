'use strict';

const HttpException = require('./http');

class AuthException extends HttpException {
  constructor(message = '令牌无效', errorCode = 10001) {
    super(errorCode, message, null, 401);
  }
}

module.exports = AuthException;
