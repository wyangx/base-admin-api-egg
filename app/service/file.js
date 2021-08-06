'use strict';

const BaseService = require('./base');
const crypto = require('crypto');
const UUID = require('uuid').v4;
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const FileException = require('../exception/file');

class FileService extends BaseService {

  async uploadFile (single = false) {
    if (!this.ctx.request.files || this.ctx.request.files.length === 0) {
      throw new FileException('请选择文件');
    }
    const rets = [];
    const files = this.ctx.request.files;
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      if (single && i > 0) {
        break;
      }
      const file = files[i];
      try {
        const { size, md5, data } = await this.checkFileInfo(file);
        const exists = await this.checkFileExists(md5);
        if (exists) {
          rets.push({ key: i, ...exists });
        } else {
          const res = await this.putFile(data, file.filename);
          await this.app.model.File.create({
            path: res.path,
            name: file.filename,
            ext: res.ext,
            size,
            md5,
            create_time: new Date(),
          });
          rets.push({
            key: i,
            path: res.path,
            url: '/' + res.path,
          });
        }
      } catch (e) {
        throw new FileException('文件上传失败');
      }
    }
    return single ? rets[0] : rets;
  }

  async checkFileInfo (file) {
    return new Promise((resolve, reject) => {
      const fsHash = crypto.createHash('md5');
      fs.readFile(file.filepath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          // 获取文件md5
          const md5 = fsHash.update(data).digest('hex');
          // 获取文件大小
          const size = data.length;
          resolve({ size, md5, data });
        }
      });
    });
  }

  async checkFileExists (md5) {
    const exists = await this.app.model.File.findOne({ where: { md5 } });
    if (exists !== null) {
      return {
        path: exists.path,
        url: '/' + exists.path,
      };
    }
    return null;
  }

  async uploadStream (single = false) {
    const { app } = this;
    const parts = await this.ctx.multipart();
    let stream;
    const files = [];
    let key = 0;
    const errors = [];
    while ((stream = await parts())) {
      if (!stream.filename) {
        continue;
      }
      try {
        const { md5, size, flieBuffer } = await this.getFileMd5(stream);
        const exists = await app.model.File.findOne({ where: { md5 } });
        if (exists !== null) {
          files.push({
            id: exists.id,
            key,
            path: exists.path,
            url: '/' + exists.path,
          });
        } else {
          if (!single || (single && key === 0)) {
            const filename = stream.filename;
            const res = await this.putFile(flieBuffer, filename);
            app.model.File.create({
              path: res.path,
              name: filename,
              ext: res.ext,
              size,
              md5,
              create_time: new Date(),
            });
            files.push({
              key,
              path: res.path,
              url: '/' + res.path,
            });
          }
        }
      } catch (e) {
        errors.push(e.message);
        continue;
      }
      key++;
    }
    if (errors.length > 0) {
      throw new FileException(errors.join(';') || '文件上传失败');
    }
    return single ? files[0] : files;
  }

  getFileExt (filename) {
    const ext = path.extname(filename);
    if (this.app._.startsWith(ext, '.')) {
      return ext.substr(1);
    }
    return ext;
  }

  createUploadPath () {
    const disk = this.app.config.file.disk;
    const local = dayjs().format('YYYYMMDD');
    const dir = disk + '/' + local;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return { dir, local };
  }

  async putFile (flieBuffer, filename) {
    return new Promise((resolve, reject) => {
      const { dir, local } = this.createUploadPath();
      const ext = this.getFileExt(filename);
      const targetName = UUID() + '.' + ext;
      fs.writeFile(dir + '/' + targetName, flieBuffer, err => {
        if (err) {
          reject(err);
        } else {
          resolve({
            path: local + '/' + targetName,
            ext,
          });
        }
      });
    });
  }

  async getFileMd5 (stream) {
    return new Promise((resolve, reject) => {
      const fsHash = crypto.createHash('md5');
      let flieBuffer;
      let size = 0;
      stream.on('data', d => {
        size += d.length;
        flieBuffer ? flieBuffer = Buffer.concat([ flieBuffer, d ]) : flieBuffer = d;
        fsHash.update(d);
      });
      stream.on('end', () => {
        const md5 = fsHash.digest('hex');
        const res = { size, md5, flieBuffer };
        resolve(res);
      });
      stream.on('error', err => {
        console.log(err);
        reject(err);
      });
    });
  }
}

module.exports = FileService;
