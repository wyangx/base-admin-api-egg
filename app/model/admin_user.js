'use strict';

const dayjs = require('dayjs');

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const adminUser = app.model.define('adminUser', {
    id: {
      type: INTEGER, primaryKey: true, autoIncrement: true,
    },
    username: STRING(32),
    nickname: STRING(32),
    mobile: STRING(11),
    avatar: STRING(255),
    gender: INTEGER,
    email: STRING(128),
    password: STRING(128),
    last_login_ip: STRING(20),
    introduction: STRING(255),
    status: INTEGER,
    create_time: {
      type: DATE,
      get () {
        const time = this.getDataValue('create_time');
        return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : null;
      },
    },
    update_time: {
      type: DATE,
      get () {
        const time = this.getDataValue('update_time');
        return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : null;
      },
    },
    delete_time: DATE,
    last_login_time: {
      type: DATE,
      get () {
        const time = this.getDataValue('last_login_time');
        return time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : null;
      },
    },
  }, {
    freezeTableName: false,
    tableName: 'admin_user',
    underscored: false,
    paranoid: true,
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'delete_time',
  });
  adminUser.associate = () => {
    app.model.AdminUser.hasMany(app.model.AdminRoleUser, {
      as: 'roles',
      foreignKey: 'user_id',
      sourceKey: 'id',
    });
  };
  return adminUser;
};
