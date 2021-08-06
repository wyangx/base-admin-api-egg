/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : base-admin

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 06/08/2021 15:59:01
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_menu
-- ----------------------------
DROP TABLE IF EXISTS `admin_menu`;
CREATE TABLE `admin_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int unsigned NOT NULL DEFAULT '0' COMMENT '父级菜单id 0是一级菜单',
  `type` int unsigned NOT NULL DEFAULT '1' COMMENT '1菜单 2按钮或操作权限',
  `route_name` varchar(128) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '前端路由名称',
  `api_route_name` varchar(128) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '接口路由名称',
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '菜单名称',
  `icon` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '菜单图标',
  `cache` int NOT NULL DEFAULT '0' COMMENT '0不缓存 1缓存',
  `affix` int NOT NULL DEFAULT '0' COMMENT '0不固定到标签栏 1固定',
  `breadcrumb` int NOT NULL DEFAULT '1' COMMENT '0不显示在面包屑 1显示',
  `hidden` int NOT NULL DEFAULT '1' COMMENT '0菜单显示 1菜单隐藏',
  `remarks` varchar(512) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注信息',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of admin_menu
-- ----------------------------
BEGIN;
INSERT INTO `admin_menu` VALUES (1, 0, 1, 'Menu', 'get@menus/tree', '菜单', 'stealth', 0, 0, 0, 0, '', 0, '2021-07-07 14:23:34', '2021-07-08 16:16:49', NULL);
INSERT INTO `admin_menu` VALUES (2, 1, 1, 'MenuList', '', '菜单管理', '', 0, 0, 1, 0, '', 0, '2021-07-07 14:25:15', '2021-07-14 15:19:14', NULL);
INSERT INTO `admin_menu` VALUES (3, 2, 2, 'updateMenu', 'put@menus/:id', '编辑菜单', '', 0, 0, 1, 0, '', 0, '2021-07-07 15:30:33', '2021-07-14 15:22:58', NULL);
INSERT INTO `admin_menu` VALUES (4, 2, 2, 'addMenu', 'post@menus', '添加菜单', '', 0, 0, 1, 0, '', 0, '2021-07-07 15:31:40', NULL, NULL);
INSERT INTO `admin_menu` VALUES (5, 2, 2, 'deleteMenu', 'delete@menus/:id', '删除菜单', '', 0, 0, 1, 0, '', 0, '2021-07-07 15:32:18', '2021-07-09 14:32:23', NULL);
INSERT INTO `admin_menu` VALUES (6, 0, 1, 'User', '', '用户', 'people', 0, 0, 0, 0, '', 0, '2021-07-07 15:54:29', '2021-07-09 14:38:39', NULL);
INSERT INTO `admin_menu` VALUES (7, 6, 1, 'UserList', 'get@users', '用户管理', '', 1, 0, 1, 0, '', 0, '2021-07-08 11:11:46', '2021-07-14 16:03:46', NULL);
INSERT INTO `admin_menu` VALUES (8, 7, 2, 'addUser', 'post@users', '添加用户', '', 0, 0, 1, 0, '', 0, '2021-07-08 11:13:54', NULL, NULL);
INSERT INTO `admin_menu` VALUES (9, 7, 2, 'updateUser', 'put@users/:id', '编辑用户', '', 0, 0, 1, 0, '', 0, '2021-07-08 11:14:55', NULL, NULL);
INSERT INTO `admin_menu` VALUES (10, 7, 2, 'deleteUser', 'delete@users/:id', '删除用户', '', 0, 0, 1, 0, '', 0, '2021-07-08 11:15:32', '2021-07-08 11:15:46', NULL);
INSERT INTO `admin_menu` VALUES (11, 0, 1, 'Role', '', '角色', 'group', 0, 0, 0, 0, '', 0, '2021-07-08 15:04:46', '2021-07-08 16:16:39', NULL);
INSERT INTO `admin_menu` VALUES (12, 11, 1, 'RoleList', 'get@roles', '角色管理', '', 0, 0, 1, 0, '', 0, '2021-07-08 15:05:24', NULL, NULL);
INSERT INTO `admin_menu` VALUES (13, 12, 2, 'addRole', 'post@roles', '添加角色', '', 0, 0, 1, 0, '', 0, '2021-07-08 16:16:28', NULL, NULL);
INSERT INTO `admin_menu` VALUES (14, 12, 2, 'updateRole', 'put@roles/:id', '编辑角色', '', 0, 0, 1, 0, '', 0, '2021-07-08 16:17:31', '2021-07-08 16:18:43', NULL);
INSERT INTO `admin_menu` VALUES (15, 12, 2, 'deleteRole', 'delete@roles/:id', '删除角色', '', 0, 0, 1, 0, '', 0, '2021-07-08 16:18:31', NULL, NULL);
INSERT INTO `admin_menu` VALUES (16, 11, 1, 'RoleMember', 'get@roles/:id/members', '角色成员管理', '', 0, 0, 1, 1, '', 0, '2021-07-10 14:23:32', '2021-07-10 14:24:09', NULL);
INSERT INTO `admin_menu` VALUES (17, 12, 2, 'roleMenu', 'post@roles/:id/menus', '角色菜单', '', 0, 0, 0, 0, '', 0, '2021-07-10 14:29:00', '2021-07-10 14:32:22', NULL);
INSERT INTO `admin_menu` VALUES (19, 0, 1, 'asdffff', '', '测试', '', 0, 0, 1, 1, '', 0, '2021-07-13 16:36:52', '2021-07-13 16:43:40', '2021-07-13 16:43:40');
INSERT INTO `admin_menu` VALUES (20, 0, 1, 'asdf', '', '测试22', '', 0, 0, 1, 0, '', 0, '2021-07-20 16:43:30', '2021-07-20 17:12:15', '2021-07-20 17:12:15');
INSERT INTO `admin_menu` VALUES (21, 16, 2, 'bindMember', 'post@roles/:id/members', '绑定成员', '', 0, 0, 1, 0, '', 0, '2021-07-23 17:07:58', NULL, NULL);
INSERT INTO `admin_menu` VALUES (22, 16, 2, 'removeMember', 'delete@roles/:id/members', '移除成员', '', 0, 0, 1, 0, '', 0, '2021-07-23 17:11:37', '2021-07-23 17:13:31', NULL);
COMMIT;

-- ----------------------------
-- Table structure for admin_role
-- ----------------------------
DROP TABLE IF EXISTS `admin_role`;
CREATE TABLE `admin_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '角色名称',
  `remarks` varchar(512) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '备注',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of admin_role
-- ----------------------------
BEGIN;
INSERT INTO `admin_role` VALUES (1, '超级管理员', '拥有最高权限', '2021-07-08 15:45:44', NULL, NULL);
INSERT INTO `admin_role` VALUES (2, '管理员', '普通管理员1', '2021-07-08 15:49:08', '2021-07-08 16:09:44', NULL);
INSERT INTO `admin_role` VALUES (3, 'test3', '测试角色', '2021-07-13 17:52:05', '2021-07-14 15:33:30', NULL);
INSERT INTO `admin_role` VALUES (4, 'test4', '', '2021-07-14 15:49:36', '2021-07-14 15:50:02', '2021-07-14 15:50:02');
INSERT INTO `admin_role` VALUES (5, '测试777', 'asdf', '2021-07-21 15:36:04', '2021-07-23 17:16:48', '2021-07-23 17:16:48');
COMMIT;

-- ----------------------------
-- Table structure for admin_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `admin_role_menu`;
CREATE TABLE `admin_role_menu` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `menu_id` int unsigned NOT NULL DEFAULT '0' COMMENT '菜单id',
  `role_id` int unsigned NOT NULL DEFAULT '0' COMMENT '角色id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=234 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of admin_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `admin_role_menu` VALUES (196, 11, 3);
INSERT INTO `admin_role_menu` VALUES (197, 12, 3);
INSERT INTO `admin_role_menu` VALUES (198, 13, 3);
INSERT INTO `admin_role_menu` VALUES (199, 14, 3);
INSERT INTO `admin_role_menu` VALUES (200, 15, 3);
INSERT INTO `admin_role_menu` VALUES (201, 16, 3);
INSERT INTO `admin_role_menu` VALUES (202, 17, 3);
INSERT INTO `admin_role_menu` VALUES (226, 1, 2);
INSERT INTO `admin_role_menu` VALUES (227, 2, 2);
INSERT INTO `admin_role_menu` VALUES (228, 3, 2);
INSERT INTO `admin_role_menu` VALUES (229, 4, 2);
INSERT INTO `admin_role_menu` VALUES (230, 11, 2);
INSERT INTO `admin_role_menu` VALUES (231, 12, 2);
INSERT INTO `admin_role_menu` VALUES (232, 13, 2);
INSERT INTO `admin_role_menu` VALUES (233, 17, 2);
COMMIT;

-- ----------------------------
-- Table structure for admin_role_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_role_user`;
CREATE TABLE `admin_role_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL COMMENT '用户id',
  `role_id` int unsigned NOT NULL COMMENT '角色id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of admin_role_user
-- ----------------------------
BEGIN;
INSERT INTO `admin_role_user` VALUES (6, 1, 2);
INSERT INTO `admin_role_user` VALUES (13, 1, 1);
INSERT INTO `admin_role_user` VALUES (16, 2, 2);
COMMIT;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `mobile` char(11) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '手机号',
  `avatar` varchar(512) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '头像',
  `gender` int unsigned NOT NULL DEFAULT '0' COMMENT '1男 2女 0未知',
  `email` varchar(128) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `password` varchar(128) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `last_login_ip` char(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '最后登录ip',
  `introduction` varchar(512) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '简介',
  `status` int unsigned NOT NULL DEFAULT '1' COMMENT '状态 1正常 2黑名单',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_time` datetime DEFAULT NULL COMMENT '是否删除',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_mobile` (`username`,`mobile`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
BEGIN;
INSERT INTO `admin_user` VALUES (1, 'admin', '超级管理员', '', '', 0, '', 'c81c41bfed5af5d58d73593c64002f09', '', '', 1, '2021-07-06 15:18:06', '2021-08-06 15:57:48', NULL, '2021-07-30 09:49:40');
INSERT INTO `admin_user` VALUES (2, 'test', '测试管理员', '', '', 0, '', 'c81c41bfed5af5d58d73593c64002f09', '', '', 1, '2021-07-07 22:23:26', '2021-08-06 15:57:50', NULL, '2021-07-23 17:28:04');
COMMIT;

-- ----------------------------
-- Table structure for area_code
-- ----------------------------
DROP TABLE IF EXISTS `area_code`;
CREATE TABLE `area_code` (
  `code` int NOT NULL COMMENT '区划代码',
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '名称',
  `level` int NOT NULL DEFAULT '1' COMMENT '1-3 省市区',
  `pcode` int NOT NULL COMMENT '父级编码',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of area_code
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '文件路径',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '文件原始名称',
  `ext` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '文件后缀',
  `size` int NOT NULL DEFAULT '0' COMMENT '文件大小',
  `md5` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '文件md5',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` datetime DEFAULT NULL COMMENT '是否删除 逻辑删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of file
-- ----------------------------
BEGIN;
INSERT INTO `file` VALUES (18, '20210730/1f84749b-22b6-4b43-806f-3fce25bc3db9.dmg', 'WeChatMac.dmg', 'dmg', 71272675, 'f46822bfd386c96897eafbe440bad62f', '2021-07-30 15:31:41', NULL, NULL);
INSERT INTO `file` VALUES (20, '20210805/c10238b3-d3c8-4f71-af22-0ac6ff137dfe.png', 'WX20210805-171646.png', 'png', 88516, 'b5816e339721319bae20f2dd3b9c9100', '2021-08-05 17:38:40', NULL, NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
