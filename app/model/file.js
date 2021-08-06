'use strict';

const dayjs = require('dayjs');

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  return app.model.define('file', {
    id: {
      type: INTEGER, primaryKey: true, autoIncrement: true,
    },
    path: STRING,
    name: STRING,
    ext: STRING,
    size: STRING,
    md5: STRING,
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
  }, {
    freezeTableName: false,
    tableName: 'file',
    underscored: false,
    paranoid: true,
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    deletedAt: 'delete_time',
  });
};
