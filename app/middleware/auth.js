'use strict';
const AuthException = require('../exception/auth');

module.exports = name => {
  return async function auth(ctx, next) {
    const token = ctx.request.headers.authorization;
    const userId = await ctx.service.jwt.getUserIdFromToken(token);
    await checkAuth(userId, ctx);
    await next();
  };

  async function checkAuth (userId, ctx) {
    if (!name) {
      return true;
    }
    const menu = await ctx.model.AdminMenu.findOne({ where: { api_route_name: name } });
    if (menu === null) {
      return true;
    }
    const roles = await ctx.model.AdminRoleUser.findAll({ attributes: [ 'role_id' ], where: { user_id: userId } });
    const roleIds = roles.map(item => item.role_id);
    if (roleIds.includes(1)) {
      return true;
    }
    const Op = ctx.app.Sequelize.Op;
    const hasAccess = await ctx.model.AdminRoleMenu.findOne({ where: { role_id: { [Op.in]: roleIds }, menu_id: menu.id } });
    if (hasAccess === null) {
      throw new AuthException('权限不足', 10002);
    }
  }
};
