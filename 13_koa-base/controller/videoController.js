/*
 * @Author: thunderchen
 * @Date: 2023-01-22 12:46:33
 * @LastEditTime: 2023-01-22 20:10:20
 * @email: 853524319@qq.com
 * @Description:  视频处理
 */

const { Video } = require('../model/index');

// 创建视频
exports.createVideo = async (ctx) => {
  let body = ctx.request.body;
  body.user = ctx.user.userInfo;

  const videoModel = new Video(body);
  try {
    let dbBack = await videoModel.save();
    ctx.body = dbBack;
  } catch (error) {
    ctx.throw(502, error);
  }
};

//获取某频道列表
exports.videoList = async (ctx) => {
  let userid = ctx.request.params.userid;

  let { pageNum = 1, pageSize = 10 } = ctx.request.body;
  let videolist = await Video.find({
    'user._id': userid,
  })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ createAt: -1 }) //排序
    .populate('user',"_id username cover"); //关联用户
  console.log(37,videolist);
  ctx.body = videolist;
};

//创建视频
