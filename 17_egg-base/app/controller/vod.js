const Controller = require('egg').Controller;
const RPCClient = require('@alicloud/pop-core').RPCClient;
class VodController extends Controller {
  // 获取凭证
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
  // 获取地址
  async getvodinfo(vodId) {
    const client = await this.vodClient('xxx', 'xxx');
    const res = await client.request(
      'GetPlayInfo',
      {
        VideoId: vodId,
      },
      {}
    );
    return res;
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
  // 获取视频详情
  async getvideo() {
    const { ctx, app } = this;
    const videoid = ctx.params.videoid;
    const dbBack = await app.model.VideoModel.findById(videoid);

    if (dbBack) {
      const videoInfo = dbBack._doc;
      const vodid = videoInfo.vodvideoId;
      const vodInfo = await this.getvodinfo(vodid);
      videoInfo.vod = vodInfo;
      ctx.body = videoInfo;
    } else {
      ctx.throw('404', '视频不存在!');
    }
  }
}

module.exports = VodController;
