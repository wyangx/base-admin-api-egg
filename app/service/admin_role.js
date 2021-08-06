'use strict';

const BaseService = require('./base');
const NotFoundException = require('../exception/not-found');
const ParamsException = require('../exception/params');
const BadRequestException = require('../exception/bad-request');

class AdminRoleService extends BaseService {

  async bindMenus (id, body) {
    const role = await this.findRole(id);
    let saveData = [];
    if (body.menu_ids.length > 0) {
      const menus = await this.ctx.model.AdminMenu.findAll({
        where: { id: body.menu_ids },
        attributes: [ 'id' ],
      });
      const menuIds = menus.map(item => item.id);
      if (menuIds.length > 0) {
        saveData = menuIds.map(item => {
          return {
            menu_id: item,
            role_id: role.id,
          };
        });
      }
    }
    const t = await this.app.model.transaction();
    try {
      // 先删除原有菜单
      await this.ctx.model.AdminRoleMenu.destroy({
        where: { role_id: role.id },
      });
      // 绑定新菜单
      if (saveData.length > 0) {
        await this.ctx.model.AdminRoleMenu.bulkCreate(saveData);
      }
      await t.commit();
    } catch (e) {
      await t.rollback();
    }
  }

  async menuList (id) {
    const role = await this.findRole(id);
    const Op = this.app.Sequelize.Op;
    return await this.ctx.model.AdminMenu.findAll({
      where: {
        id: {
          [Op.in]: this.app.model.literal(`(SELECT menu_id FROM admin_role_menu WHERE role_id = ${role.id})`),
        },
      },
      attributes: [ 'id', 'title', 'parent_id' ],
    });
  }

  async bindMembers (id, body) {
    const role = await this.findRole(id);
    const userIds = body.user_ids.map(item => parseInt(item));
    const bindedUsers = await this.ctx.model.AdminRoleUser.findAll({
      where: { role_id: role.id, user_id: userIds },
    });
    const bindedUserIds = bindedUsers.map(item => item.user_id);
    const saveData = userIds.reduce((arr, val) => {
      if (!bindedUserIds.includes(val)) {
        arr.push({ user_id: val, role_id: role.id });
      }
      return arr;
    }, []);
    // const saveData = userIds.reduce((arr, val) => (!bindedUserIds.includes(val) ? (arr.push({ user_id: val, role_id: role.id }), arr) : arr), []);
    if (saveData.length > 0) {
      await this.ctx.model.AdminRoleUser.bulkCreate(saveData);
    }
  }

  async unbindMembers (id, body) {
    const role = await this.findRole(id);
    const userIds = body.user_ids.map(item => parseInt(item));
    await this.ctx.model.AdminRoleUser.destroy({
      where: { role_id: role.id, user_id: userIds },
    });
  }

  async memberList (id) {
    const role = await this.findRole(id);
    const Op = this.app.Sequelize.Op;
    const where = {
      ...this.ctx.service.adminUser.queryWhere(),
      id: {
        [Op.in]: this.app.model.literal(`(SELECT user_id FROM admin_role_user WHERE role_id = ${id})`),
      },
    };
    const data = await this.app.model.AdminUser.findAndCountAll({
      where,
      attributes: { exclude: [ 'delete_time', 'password' ] },
      order: [[ 'id', 'DESC' ]],
      ...this.pageParam(),
    });
    return {
      ...this.countAllPaginate(data),
      role,
    };
  }

  async findRole (id) {
    const role = await this.app.model.AdminRole.findOne({ where: { id }, attributes: { exclude: [ 'delete_time' ] } });
    if (role === null) {
      throw new NotFoundException('角色不存在', 21000);
    }
    return role;
  }

  async createRole (body) {
    const model = this.app.model.AdminRole;
    const params = this.app._.cloneDeep(body);
    const role = await model.findOne({ where: { name: params.name } });
    if (role !== null) {
      throw new ParamsException('角色名重复');
    }
    params.create_time = new Date();
    await model.create(params);
  }

  async updateRole (id, body) {
    const role = await this.findRole(id);
    const { Op } = this.app.Sequelize;
    const { name, remarks } = body;
    const where = {
      id: { [Op.ne]: id },
      name,
    };
    const hasRole = await this.app.model.AdminRole.findOne({ where });
    if (hasRole !== null) {
      throw new ParamsException('角色名重复');
    }
    await role.update({ name, remarks });
  }

  async deleteRole (id) {
    const t = await this.app.model.transaction();
    const role = await this.findRole(id);
    try {
      // 删除菜单角色
      await this.app.model.AdminRoleMenu.destroy({
        where: { role_id: id },
      });
      // 删除用户角色
      await this.app.model.AdminRoleUser.destroy({
        where: { role_id: id },
      });
      // 删除角色
      await role.destroy();
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw new BadRequestException(21006, '角色删除失败');
    }
  }

  queryWhere () {
    const { query } = this.ctx;
    const where = {};
    const keyword = this.app._.isString(query.keyword) ? this.app._.trim(query.keyword) : '';
    if (keyword && keyword.length > 0) {
      const { Op } = this.app.Sequelize;
      where.name = {
        [Op.like]: `%${keyword}%`,
      };
    }
    return where;
  }

  async getRoleList () {
    const data = await this.ctx.model.AdminRole.findAndCountAll({
      where: this.queryWhere(),
      attributes: { exclude: [ 'delete_time' ] },
      order: [[ 'id', 'ASC' ]],
      ...this.pageParam(),
    });
    return this.countAllPaginate(data);
  }
}

module.exports = AdminRoleService;
