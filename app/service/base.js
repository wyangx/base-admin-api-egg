'use strict';

const Service = require('egg').Service;

class BaseService extends Service {
  pageParam () {
    const params = this.ctx.query;
    const page = this.getCurrentPage();
    let limit = 20;
    if (params.limit && parseInt(params.limit) > 0 && parseInt(params.limit) <= 100) {
      limit = parseInt(params.limit);
    }
    return {
      offset: (page - 1) * limit,
      limit,
    };
  }

  getCurrentPage () {
    const params = this.ctx.query;
    let page = 1;
    if (params.page && parseInt(params.page) > 0) {
      page = parseInt(params.page);
    }
    return page;
  }

  paginate (count, rows) {
    const { limit } = this.pageParam();
    return {
      total: count,
      per_page: limit,
      current_page: this.getCurrentPage(),
      last_page: count % limit > 0 ? parseInt(count / limit + '') + 1 : parseInt(count / limit + ''),
      data: rows,
    };
  }

  countAllPaginate (data) {
    const { count, rows } = data;
    return this.paginate(count, rows);
  }
}

module.exports = BaseService;
