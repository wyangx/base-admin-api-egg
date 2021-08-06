'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize;

  return app.model.define('adminRoleUser', {
    id: {
      type: INTEGER, primaryKey: true, autoIncrement: true,
    },
    user_id: INTEGER,
    role_id: INTEGER,
  }, {
    freezeTableName: false,
    tableName: 'admin_role_user',
    underscored: false,
    timestamps: false,
  });
};
