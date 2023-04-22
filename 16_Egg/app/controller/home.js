'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx, service } = this;
    const userData = service.user.getUserList();
    ctx.body = userData;
  }
}

module.exports = HomeController;
