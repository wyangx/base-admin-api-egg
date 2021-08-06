'use strict';

module.exports = app => {
  const { validator } = app;

  validator.addRule('posint', (rule, value) => {
    const fieldName = rule.field || '';
    const require = rule.require === undefined || rule.require;
    const message = rule.message || '';
    if (require) {
      if (parseInt(value) !== 0 && !value) {
        return fieldName + '必填';
      }
    }
    if (value && !/^\d+$/.test(value)) {
      return message || fieldName + '只能是正整数';
    }
  });

  validator.addRule('userpass', (rule, value) => {
    if (!value) {
      return '密码必填';
    } else if (!/^[a-zA-Z0-9_\-!@#$%^&*?~<>\\\/+= ]{6,20}$/.test(value)) {
      return '密码格式不正确,长度6-20字符';
    }
  });

  validator.addRule('name', (rule, value) => {
    const fieldName = rule.field || '';
    const min = rule.min ? rule.min : 0;
    const max = rule.max ? rule.max : 0;
    const require = rule.require === undefined || rule.require;
    const message = rule.message || '';
    if (require) {
      if (!value) {
        return fieldName + '必填';
      }
    }
    if (value && typeof value !== 'string') {
      return message || fieldName + '必须是字符串';
    } else if (value) {
      if (min > 0 && max === 0 && value.length < min) {
        return message || fieldName + '长度不能小于' + min + '字符';
      }
      if (min === 0 && max > 0 && value.length > max) {
        return message || fieldName + '长度不能大于' + max + '字符';
      }
      if (min > 0 && max > 0 && (value.length < min || value.length > max)) {
        return message || fieldName + '长度' + min + '-' + max + '字符';
      }
    }
  });

  validator.addRule('mobile', (rule, value) => {
    const require = rule.require === undefined || rule.require;
    if (require && !value) {
      return '手机号必填';
    }
    if (value && !/^1(2|3|4|5|6|7|8|9)[0-9]\d{8}/.test(value)) {
      return '手机号码不正确';
    }
  });

  validator.addRule('in_arr', (rule, value) => {
    const fieldName = rule.field || '';
    const arr = rule.arr ? rule.arr : [ 0, 1 ];
    const require = rule.require === undefined || rule.require;
    if (require && !value && value !== 0 && parseInt(value) !== 0) {
      return fieldName + '必填';
    }
    if (value && (!arr.includes(value) && !arr.includes(parseInt(value)))) {
      return fieldName + '只能是' + arr.join(',');
    }
  });

  validator.addRule('ids', (rule, value) => {
    const fieldName = rule.field || '';
    const require = rule.require === undefined || rule.require;
    if (require && (!value || value.length === 0)) {
      return fieldName + '必填';
    }
    if (!app._.isArray(value)) {
      return fieldName + '只能是数组';
    }
    for (let i = 0; i < value.length; i++) {
      const v = parseInt(value[i]);
      if (!app._.isFinite(v) || !/^\d+$/.test(v)) {
        return fieldName + '每一项必须是正整数';
      }
    }
  });
};
