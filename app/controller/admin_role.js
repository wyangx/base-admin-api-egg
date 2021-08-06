'use strict';

const BaseController = require('./base');
const roleValidator = {
  name: { type: 'name', require: true, max: 50, field: '角色名称' },
  remarks: { require: false, type: 'name', max: 100, field: '备注信息' },
};

class AdminRoleController extends BaseController {
  async readRole () {
    const data = await this.ctx.service.adminRole.findRole(this.ctx.params.id);
    this.success(data);
  }

  async createRole () {
    this.ctx.validate(roleValidator);
    const { body } = this.ctx.request;
    await this.ctx.service.adminRole.createRole(body);
    this.success();
  }

  async updateRole () {
    this.ctx.validate(roleValidator);
    const { id } = this.ctx.params;
    const { body } = this.ctx.request;
    await this.ctx.service.adminRole.updateRole(id, body);
    this.success();
  }

  async deleteRole () {
    const { id } = this.ctx.params;
    await this.ctx.service.adminRole.deleteRole(id);
    this.success();
  }

  async roleList () {
    const data = await this.ctx.service.adminRole.getRoleList();
    this.success(data);
  }

  async memberList () {
    const res = await this.ctx.service.adminRole.memberList(this.ctx.params.id);
    this.success(res);
  }

  async bindMember () {
    this.ctx.validate({
      user_ids: { require: true, type: 'ids', field: '用户id' },
    });
    const { body } = this.ctx.request;
    const { id } = this.ctx.params;
    await this.ctx.service.adminRole.bindMembers(id, body);
    this.success();
  }

  async removeMembers () {
    this.ctx.validate({
      user_ids: { require: true, type: 'ids', field: '用户id' },
    });
    const { body } = this.ctx.request;
    const { id } = this.ctx.params;
    await this.ctx.service.adminRole.unbindMembers(id, body);
    this.success();
  }

  async menuList () {
    const { id } = this.ctx.params;
    const data = await this.ctx.service.adminRole.menuList(id);
    this.success(data);
  }

  async bindMenus () {
    this.ctx.validate({
      menu_ids: { require: false, type: 'ids', field: '菜单id' },
    });
    const { body } = this.ctx.request;
    const { id } = this.ctx.params;
    this.ctx.service.adminRole.bindMenus(id, body);
    this.success();
  }
}

module.exports = AdminRoleController;
