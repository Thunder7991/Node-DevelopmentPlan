const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    ctx.validate({
      username: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    });
    ctx.body = 'user';
  }
}

module.exports = UserController;
