'use strict';

const BaseService = require('./base');
const FileException = require('../exception/file');
const dayjs = require('dayjs');
const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const UUID = require('uuid').v4;

class FileChunkService extends BaseService {
  // 上传分片
  async uploadChunk () {
    // 默认只上传一个切片,只处理文件的第一个
    // 验证切片信息
    const { chunk, chunkname, md5 } = await this.verifyChunk();
    // 如果切片不存在保存切片
    const err = await this.writeChunk(chunk, md5, chunkname);
    if (err) {
      throw new FileException('文件切片保存失败');
    }
  }

  // 合并切片
  async mergeChunks () {
    const { body } = this.ctx.request;
    // 校验切片数量
    const chunkPaths = await this.verifyChunks(body.md5, body.file_chunk_num);
    // 合并文件
    const ret = await this.chunksCombine(chunkPaths, body.filename, body.md5);
    // 数据库存储结果
    await this.ctx.model.File.create({
      path: ret.path,
      name: ret.name,
      ext: ret.ext,
      size: ret.size,
      md5: body.md5,
      create_time: new Date(),
    });
    return { path: ret.path, url: '/' + ret.path };
  }

  // 检测文件是否存在
  async checkPresence () {
    const params = this.ctx.query;
    const exists = await this.ctx.service.file.checkFileExists(params.md5);
    const response = {
      presence: false,
      path: '',
      url: '',
    };
    if (exists !== null) {
      response.presence = true;
      const { path, url } = exists;
      response.path = path;
      response.url = url;
    }
    return response;
  }

  /**
   * 将切片合并到文件
   * @param {Array} chunkPaths 切片文件名
   * @param {string} originName 原始文件名称
   * @param {string} md5 文件MD5
   * @return {Promise<{ext: string, path: string, name: string}>} promise
   */
  async chunksCombine (chunkPaths, originName, md5) {
    // 获取后缀名
    const ext = path.extname(originName);
    const md5Path = path.join(this.app.config.file.disk, md5);
    // 创建新目录
    const local = dayjs().format('YYYYMMDD');
    const destDir = path.join(this.app.config.file.disk, local);
    this.mkdir(destDir);
    // 创建新文件
    const newFileName = UUID() + ext;
    const newFile = path.join(destDir, newFileName);
    fse.createFileSync(newFile);
    // 将切片依次写入
    let size = 0;
    for (let i = 0; i < chunkPaths.length; i++) {
      const tempFilePath = path.join(md5Path, chunkPaths[i]);
      const data = fs.readFileSync(tempFilePath);
      size += data.length;
      fs.appendFileSync(newFile, data);
    }
    // 删除切片及切片目录
    fse.remove(md5Path);
    return {
      ext: ext.substr(1),
      path: path.join(local, newFileName),
      name: originName,
      size,
    };
  }

  // 校验切片是否存在及数量是否正确
  async verifyChunks (md5, chunkNum) {
    const md5Path = path.join(this.app.config.file.disk, md5);
    const chunkPaths = fs.readdirSync(md5Path);
    if (chunkPaths.length === 0 || chunkPaths.length !== parseInt(chunkNum)) {
      throw new FileException('切片数量不正确');
    }
    return chunkPaths;
  }

  /**
   * 保存切片
   * @param {string} chunk 临时切片路径
   * @param {string} md5 文件md5
   * @param {string} chunkname 切片下标
   */
  async writeChunk (chunk, md5, chunkname) {
    // 创建临时文件目录
    const { dir } = await this.createTmpDir(md5);
    const chunkPath = `${dir}/${md5}-${chunkname}`;
    return new Promise(resolve => {
      // 写入文件
      this.checkFileExists(chunkPath).then(exists => {
        if (!exists) {
          // 创建文件
          // fse.createFileSync(chunkPath);
          fse.copy(chunk, chunkPath, {
            overwrite: true,
          }, err => {
            if (err) {
              return resolve(err);
            }
            return resolve(null);
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  // 检查文件是否存在
  async checkFileExists (filePath) {
    return new Promise(resolve => {
      fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
          resolve(false);
          return;
        }
        return resolve(true);
      });
    });
  }

  // 创建临时目录
  async createTmpDir (md5) {
    const disk = this.app.config.file.disk;
    const dir = path.join(disk, md5);
    if (!fse.pathExistsSync(dir)) {
      fse.mkdirsSync(dir);
    }
    return { dir };
  }

  // 创建目录
  mkdir (path) {
    if (!fse.pathExistsSync(path)) {
      fse.mkdirsSync(path);
    }
  }

  async verifyChunk () {
    if (!this.ctx.request.files || this.ctx.request.files.length === 0) {
      throw new FileException('请选择文件');
    }
    const md5 = this.ctx.get('md5');
    const filename = this.ctx.get('filename');
    if (!md5 || !filename) {
      throw new FileException('文件切片信息不完整');
    }
    return {
      chunk: this.ctx.request.files[0].filepath,
      md5,
      chunkname: filename,
    };
  }
}

module.exports = FileChunkService;
