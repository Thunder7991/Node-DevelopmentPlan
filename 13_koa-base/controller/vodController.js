/*
 * @Author: thunderchen
 * @Date: 2023-01-22 11:00:02
 * @LastEditTime: 2023-01-22 20:41:04
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
const getVodPlay = async (vodid) => {
  var client = initVodClient(
    'LTAI5tQaCWqun1sxXnMhkPrx',
    'PV4Ll8ak0EQDnHnq9iGOXhj28fIOp9',
  );
  try {
    let response = await client.request(
      'GetPlayInfo',
      {
        VideoId: vodid,
      },
      {},
    );

    return response;
  } catch (error) {
    // console.log(error);
    throw new Error('获取视频信息异常!');
  }
};
exports.getVodPlay = getVodPlay;
//获取播放地址
exports.getPlayer = async (ctx) => {
  let paly = await getVodPlay(ctx.require.query.vodid);
  ctx.body = paly;
};
