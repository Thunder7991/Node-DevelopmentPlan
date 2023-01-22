/*
 * @Author: thunderchen
 * @Date: 2023-01-22 11:00:02
 * @LastEditTime: 2023-01-22 19:30:40
 * @email: 853524319@qq.com
 * @Description:  视频管理控制器
 */

//获取阿里云vod相关接口
var RPCClient = require('@alicloud/pop-core').RPCClient;
function initVodClient(accessKeyId, accessKeySecret) {
  var regionId = 'cn-beijing'; // 点播服务接入地域
  var client = new RPCClient({
    //填入AccessKey信息
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
    apiVersion: '2017-03-21',
  });

  return client;
}
exports.getvod = async (ctx) => {
  // 请求示例
  var client = initVodClient(
    'LTAI5t9E91CjMewUdCZD79Vt',
    '88888888888888888888',
  );
  const vodback = await client.request(
    'CreateUploadVideo',
    {
      Title: ctx.request.query.title,
      FileName: ctx.request.query.filename,
    },
    {},
  );
  //  获取上传凭证
  ctx.body = vodback;
};

exports.getPlayer = async (ctx) => {
  // 调用样例
  // 请求示例
  var client = initVodClient(
    'LTAI5tQaCWqun1sxXnMhkPrx',
    '**************',
  );
  try {
    let response = await client.request(
      'GetPlayInfo',
      {
        VideoId: '13c3b06089ae71edb9ed16b5feac0102',
      },
      {},
    );
    ctx.body = response;
  } catch (error) {
    console.log(error);
  }
};
