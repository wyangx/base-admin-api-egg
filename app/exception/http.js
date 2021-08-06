'use strict';

class HttpException extends Error {
  constructor(code = 50000, message = '服务器内部异常', data = null, httpCode = 500) {
    super();
    this.code = code;
    this.msg = message;
    this.data = data;
    this.httpCode = httpCode;
  }
}

module.exports = HttpException;
