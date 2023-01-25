const Controller = require('egg').Controller;
const RPCClient = require('@alicloud/pop-core').RPCClient;
class VodController extends Controller {
  async vodClient(accessKeyId, accessKeySecret) {
    const regionId = 'cn-shanghai'; // 点播服务接入地域
    const client = new RPCClient({
      // 填入AccessKey信息
      accessKeyId,
      accessKeySecret,
      endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
      apiVersion: '2017-03-21',
    });
    return client;
  }
  async getvod() {
    const { ctx } = this;
    const query = ctx.query;
    ctx.validate(
      {
        title: { type: 'string' },
        filename: { type: 'string' },
      },
      query
    );
    const client = await this.vodClient();
    const vodBack = await client.request(
      'CreateUploadVideo',
      {
        Title: query.title,
        FileName: query.filename,
      },
      {}
    );
    ctx.body = vodBack;
  }
}

module.exports = VodController;
