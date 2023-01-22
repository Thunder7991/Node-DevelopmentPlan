/*
 * @Author: thunderchen
 * @Date: 2023-01-22 12:46:33
 * @LastEditTime: 2023-01-22 19:04:48
 * @email: 853524319@qq.com
 * @Description:  视频处理
 */

const { Video } = require('../model/index');

// 创建视频
exports.createVideo = async (ctx) => {
  let body = ctx.request.body;
  body.user = ctx.user.userInfo._id;

  const videoModel = new Video(body);
  try {
    let dbBack = await videoModel.save();
    ctx.body = dbBack;
  } catch (error) {
    ctx.throw(502, error);
  }
};
