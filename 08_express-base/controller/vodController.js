//获取阿里云vod相关接口
var RPCClient = require("@alicloud/pop-core").RPCClient;
function initVodClient(accessKeyId, accessKeySecret) {
  var regionId = "cn-beijing"; // 点播服务接入地域
  var client = new RPCClient({
    //填入AccessKey信息
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    endpoint: "http://vod." + regionId + ".aliyuncs.com",
    apiVersion: "2017-03-21",
  });

  return client;
}
exports.getvod = async (req, res) => {
  // 请求示例
  var client = initVodClient(
    "LTAI5t9E91CjMewUdCZD79Vt",
    "f722ZXzMUQl***************"
  );
 const vodback =  await client.request(
    "CreateUploadVideo",
    {
      Title: "this is a sample",
      FileName: "filename.mp4",
    },
    {}
  )
  res.status(200).json({vod:vodback})

};
