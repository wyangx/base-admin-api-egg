'use strict';

const UUID = require('uuid').v4;
const svgCaptcha = require('svg-captcha');
const BaseService = require('./base');
const ParamsException = require('../exception/params');
const crypto = require('crypto');
const BadRequestException = require('../exception/bad-request');
const NotFoundException = require('../exception/not-found');

class AdminUserService extends BaseService {

  async getUserList () {
    const { AdminUser, AdminRoleUser } = this.app.model;
    // AdminUser.hasMany(AdminRoleUser, {
    //   as: 'roles',
    //   foreignKey: 'user_id',
    //   targetKey: 'id',
    // });
    const { count, rows } = await AdminUser.findAndCountAll({
      where: this.queryWhere(),
      attributes: { exclude: [ 'delete_time', 'password' ] },
      include: [
        {
          model: AdminRoleUser,
          as: 'roles',
          attributes: [ 'user_id', 'role_id' ],
        },
      ],
      ...this.pageParam(),
    });
    return this.paginate(count, rows);
  }

  queryWhere () {
    const { Op } = this.app.Sequelize;
    const { query } = this.ctx;
    const where = {};
    const keyword = this.app._.trim(query.keyword);
    if (keyword && keyword.length > 0) {
      where[Op.and] = {
        [Op.or]: [
          { username: { [Op.like]: `%${keyword}%` } },
          { mobile: { [Op.like]: `%${keyword}%` } },
        ],
      };
    }
    const status = parseInt(query.status);
    if (!isNaN(status) && [ 1, 2 ].includes(status)) {
      where.status = status;
    }
    return where;
  }

  async createUser (params) {
    const model = this.app.model.AdminUser;
    const user = await model.findOne({ where: { username: params.username } });
    if (user !== null) {
      throw new ParamsException('用户名重复');
    }
    const mobileUser = await model.findOne({ where: { mobile: params.mobile } });
    if (mobileUser !== null) {
      throw new ParamsException('手机号码重复');
    }
    params.password = this.encryptPassword(params.password);
    params.create_time = new Date();
    await model.create(params);
  }

  async updateUser (id, params) {
    const user = await this.findUser(id);
    user.username = params.username;
    user.nickname = params.nickname;
    user.mobile = params.mobile;
    user.status = params.status;
    await user.save();
  }

  async deleteUser (id) {
    const user = await this.findUser(id);
    await user.destroy();
  }

  async getUserInfo (userId) {
    const user = await this.findUser(userId);
    const QueryTypes = this.app.Sequelize.QueryTypes;
    const roles = await this.app.model.query('SELECT `id`,`name` FROM `admin_role` WHERE (  `id` IN (SELECT `role_id` FROM `admin_role_user` WHERE  `user_id` = :userId) ) AND `admin_role`.`delete_time` IS NULL', { type: QueryTypes.SELECT, replacements: { userId } });
    const roleIds = roles.map(item => item.id);
    let menu = [];
    if (roleIds.includes(1)) {
      menu = await this.app.model.AdminMenu.findAll({ order: [[ 'sort', 'ASC' ], [ 'id', 'ASC' ]], attributes: { exclude: [ 'delete_time' ] } });
    } else {
      if (roleIds.length === 0) {
        throw new BadRequestException(20022, '用户未绑定角色');
      }
      menu = await this.app.model.query('SELECT * FROM `admin_menu` WHERE (  `id` IN (SELECT `menu_id` FROM `admin_role_menu` WHERE  `role_id` IN (:roleIds)) ) AND `admin_menu`.`delete_time` IS NULL ORDER BY `sort` ASC, `id` DESC ', { type: QueryTypes.SELECT, replacements: { roleIds } });
    }
    user.dataValues.roles = roles;
    user.dataValues.menus = menu;
    return user;
  }

  async findUser (userId) {
    const user = await this.app.model.AdminUser.findOne({ where: { id: userId }, attributes: { exclude: [ 'delete_time' ] } });
    if (user === null) {
      throw new NotFoundException('用户不存在', 20000);
    }
    return user;
  }

  async login (params) {
    // 校验验证码
    await this.validCaptcha(params.captcha_token, params.captcha);
    let user = await this.app.model.AdminUser.findOne({ where: { username: params.username } });
    if (user === null) {
      user = await this.app.model.AdminUser.findOne({ where: { mobile: params.username } });
    }
    if (user === null) {
      throw new BadRequestException(20001, '账号密码不匹配');
    }
    if (user.password !== this.encryptPassword(params.password)) {
      throw new BadRequestException(20001, '账号密码不匹配');
    }
    if (user.status === 2) {
      throw new BadRequestException(20002, '用户已禁用');
    }
    await this.app.model.AdminUser.update({ last_login_time: new Date() }, { where: { id: user.id } });
    return await this.ctx.service.jwt.awardToken(user.id);
  }

  encryptPassword (password) {
    const key = this.md5Encrypt('12345654321');
    const pass = this.md5Encrypt(password);
    return this.md5Encrypt(pass + key);
  }

  md5Encrypt (str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  async createCaptcha () {
    const token = UUID();
    const captcha = svgCaptcha.create({
      size: 5,
      ignoreChars: '0o1il',
      background: '#ffffff',
      width: 120,
      height: 36,
    });
    const cacheData = {
      code: captcha.text,
      times: 0,
    };
    await this.app.redis.set(token, JSON.stringify(cacheData), 'ex', 300);
    return {
      text: captcha.text,
      token,
      code: captcha.data,
    };
  }
  async validCaptcha (token, text) {
    let captcha = await this.app.redis.get(token);
    if (!captcha) {
      throw new ParamsException('验证码不正确');
    }
    captcha = JSON.parse(captcha);
    if (!captcha.code) {
      throw new ParamsException('验证码不正确');
    }
    if (text.toLowerCase() !== captcha.code.toLowerCase()) {
      let times = captcha.times;
      times += 1;
      if (times >= 5) {
        await this.app.redis.del(token);
      } else {
        captcha.times = times;
        const ttl = this.app.redis.ttl(token);
        if (ttl > 1) {
          await this.app.redis.set(token, JSON.stringify(captcha), 'ex', parseInt(ttl));
        }
      }
      throw new ParamsException('验证码不正确');
    }
    await this.app.redis.del(token);
    return true;
  }
}

module.exports = AdminUserService;
