'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const userInfo = await this.app.model.User.find();
    ctx.body = userInfo;
  }
}

module.exports = HomeController;
