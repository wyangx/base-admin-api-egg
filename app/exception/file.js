'use strict';

const HttpException = require('./http');

class FileException extends HttpException {
  constructor(message = '') {
    super(60000, message, null, 413);
  }
}

module.exports = FileException;
