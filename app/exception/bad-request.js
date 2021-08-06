'use strict';

const HttpException = require('./http');
class BadRequestException extends HttpException {
  constructor(errorCode = 99999, message = '') {
    super(errorCode, message, null, 413);
  }
}

module.exports = BadRequestException;
