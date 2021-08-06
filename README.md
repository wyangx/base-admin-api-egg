# egg-base-api

Egg.js 前后端分离基础功能接口。

必须提前安装mysql，导入sql文件，修改配置文件中`config.sequelize` 填入自己mysql信息。

由于前后端分离，图片验证码使用了 `redis`，如果使用图片验证码功能需要提前安装 `redis`，修改配置文件中 `config.redis` 。

默认超级管理员账号: admin，密码: abc888888

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### 自定义异常

~~~
app/exception/
~~~

### 中间件

~~~
app/middleware/
~~~

### 插件

+ egg-validate
+ egg-sequelize
+ egg-cors
+ egg-jwt
+ egg-redis

## 目前实现的接口

### 用户管理

+ 验证码 /admin/users/captcha
+ 用户登录 /admin/users/login
+ 刷新登录状态 /admin/users/refresh-token
+ 新增用户 /admin/users
+ 更新用户 /admin/users/:id
+ 删除用户 /admin/users/:id
+ 获取用户及权限角色信息 /admin/users/info
+ 用户列表 /admin/users

### 菜单管理

+ 获取菜单树 /admin/menus/tree
+ 新增菜单 /admin/menus
+ 更新菜单 /admin/menus/:id
+ 获取菜单详情 /admin/menus/:id
+ 删除菜单 /admin/menus/:id

### 角色管理

+ 获取角色详情 /admin/roles/:id
+ 新增角色 /admin/roles
+ 更新角色 /admin/roles/:id
+ 删除角色 /admin/roles/:id
+ 角色列表 /admin/roles
+ 角色成员列表 /admin/roles/:id/members
+ 角色绑定成员 /admin/roles/:id/members
+ 角色解绑成员 /admin/roles/:id/members
+ 角色菜单列表 /admin/roles/:id/menus
+ 更新角色菜单 /admin/roles/:id/menus

### 文件上传

+ 单文件上传 /admin/file
