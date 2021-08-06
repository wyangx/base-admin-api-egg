'use strict';

const BaseController = require('./base');

class FileController extends BaseController {
  async upload () {
    const data = await this.ctx.service.file.uploadFile(false);
    this.success(data);
  }

  async chunk () {
    await this.ctx.service.fileChunk.uploadChunk();
    this.success();
  }

  async chunkMerge () {
    this.ctx.validate({
      md5: { require: true, type: 'name', min: 32, max: 32, field: 'md5' },
      filename: { require: true, type: 'name', min: 1, max: 100, field: '文件名称' },
      file_chunk_num: { require: true, type: 'posint', field: '切片数量' },
    });
    const res = await this.ctx.service.fileChunk.mergeChunks();
    this.success(res);
  }

  async chunkPresence () {
    const params = this.ctx.query;
    this.ctx.validate({
      md5: { require: true, type: 'name', min: 32, max: 32, field: 'md5' },
      filename: { require: true, type: 'name', min: 1, max: 100, field: '文件名称' },
    }, params);
    const res = await this.ctx.service.fileChunk.checkPresence();
    this.success(res);
  }
}

module.exports = FileController;
