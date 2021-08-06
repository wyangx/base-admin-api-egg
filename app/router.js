'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth;
  // 用户管理
  router.get('/admin/users/captcha', controller.adminUser.captcha);
  router.post('/admin/users/login', controller.adminUser.login);
  router.post('/admin/users/refresh-token', controller.adminUser.refreshToken);
  router.post('/admin/users', auth('post@users'), controller.adminUser.createUser);
  router.put('/admin/users/:id', auth('put@users/:id'), controller.adminUser.updateUser);
  router.delete('/admin/users/:id', auth('delete@users/:id'), controller.adminUser.deleteUser);
  router.get('/admin/users/info', auth('get@users/info'), controller.adminUser.userInfo);
  router.get('/admin/users', auth('get@users'), controller.adminUser.userList);

  // 菜单管理
  router.get('/admin/menus/tree', auth('get@menus/tree'), controller.adminMenu.menuTree);
  router.post('/admin/menus', auth('post@menus'), controller.adminMenu.createMenu);
  router.put('/admin/menus/:id', auth('put@menus/:id'), controller.adminMenu.updateMenu);
  router.get('/admin/menus/:id', auth('get@menus/:id'), controller.adminMenu.readMenu);
  router.delete('/admin/menus/:id', auth('delete@menus/:id'), controller.adminMenu.deleteMenu);

  // 角色管理
  router.get('/admin/roles/:id', auth('get@roles/:id'), controller.adminRole.readRole);
  router.post('/admin/roles', auth('post@roles'), controller.adminRole.createRole);
  router.put('/admin/roles/:id', auth('put@roles/:id'), controller.adminRole.updateRole);
  router.delete('/admin/roles/:id', auth('delete@roles/:id'), controller.adminRole.deleteRole);
  router.get('/admin/roles', auth('get@roles'), controller.adminRole.roleList);
  router.get('/admin/roles/:id/members', auth('get@roles/:id/members'), controller.adminRole.memberList);
  router.post('/admin/roles/:id/members', auth('post@roles/:id/members'), controller.adminRole.bindMember);
  router.delete('/admin/roles/:id/members', auth('delete@roles/:id/members'), controller.adminRole.removeMembers);
  router.get('/admin/roles/:id/menus', auth('get@roles/:id/menus'), controller.adminRole.menuList);
  router.post('/admin/roles/:id/menus', auth('post@roles/:id/menus'), controller.adminRole.bindMenus);


  // 分片上传
  router.get('/admin/file/chunk/presence', auth('get@file/chunk/presence'), controller.file.chunkPresence);
  router.post('/admin/file/chunk/merge', auth('post@file/chunk/merge'), controller.file.chunkMerge);
  router.post('/admin/file/chunk', auth('post@file/chunk'), controller.file.chunk);
  // 普通文件上传
  router.post('/admin/file', auth('post@file'), controller.file.upload);
};
