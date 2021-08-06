'use strict';

const BaseController = require('./base');

class AdminUserController extends BaseController {

  async login () {
    this.ctx.validate({
      username: { type: 'name', require: true, min: 4, max: 20, field: '账号' },
      password: { type: 'password', require: true },
      captcha: { type: 'name', require: true, min: 4, max: 6, message: '验证码不正确' },
      captcha_token: { type: 'name', require: true, message: '验证码不正确' },
    });
    const data = this.ctx.request.body;
    const res = await this.ctx.service.adminUser.login(data);
    this.success(res);
  }

  async refreshToken () {
    this.ctx.validate({
      refresh_token: { type: 'name', require: true, max: 1000, field: '刷新token' },
    });
    const data = await this.ctx.service.jwt.refreshToken(this.ctx.request.body.refresh_token);
    return this.success(data);
  }

  async userInfo () {
    const token = this.ctx.request.headers.authorization;
    const userId = await this.ctx.service.jwt.getUserIdFromToken(token);
    const data = await this.ctx.service.adminUser.getUserInfo(userId);
    return this.success(data);
  }

  async captcha () {
    const data = await this.ctx.service.adminUser.createCaptcha();
    this.success(data);
  }


  async userList () {
    const data = await this.service.adminUser.getUserList();
    this.success(data);
  }

  async createUser () {
    this.ctx.validate({
      username: { type: 'name', require: true, min: 4, max: 20, field: '账号' },
      nickname: { type: 'name', require: false, min: 2, max: 20, field: '昵称' },
      mobile: { type: 'mobile', require: false },
      password: { type: 'userpass', require: true },
      status: { type: 'in_arr', require: true, arr: [ 1, 2 ], field: '状态' },
    });
    await this.ctx.service.adminUser.createUser(this.ctx.request.body);
    this.success();
  }

  async updateUser () {
    this.ctx.validate({
      username: { type: 'name', require: true, min: 4, max: 20, field: '账号' },
      nickname: { type: 'name', require: false, min: 2, max: 20, field: '昵称' },
      mobile: { type: 'mobile', require: false },
      status: { type: 'in_arr', require: true, arr: [ 1, 2 ], field: '状态' },
    });
    await this.ctx.service.adminUser.updateUser(this.ctx.params.id, this.ctx.request.body);
    this.success();
  }

  async deleteUser () {
    await this.ctx.service.adminUser.deleteUser(this.ctx.params.id);
    this.success();
  }
}

module.exports = AdminUserController;
