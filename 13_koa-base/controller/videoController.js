/*
 * @Author: thunderchen
 * @Date: 2023-01-22 12:46:33
 * @LastEditTime: 2023-01-23 15:50:01
 * @email: 853524319@qq.com
 * @Description:  视频处理
 */

const { Video, Videocomment } = require('../model/index');

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
    .populate('user', '_id username cover'); //关联用户
  console.log(37, videolist);
  ctx.body = videolist;
};

//获取视频详情
exports.getvideodetail = async (ctx) => {
  const videoid = ctx.request.params.videoid;
  let dbBack = await Video.findById(videoid).populate(
    'user',
    '_id username cover',
  );
  let videoinfo = dbBack._doc;
  if (!dbBack) {
    ctx.throw(501, '视频不存在!');
  } else {
    const { getVodPlay } = require('./vodController');
    let vodinfo = await getVodPlay(videoinfo.vodvideoId);
    videoinfo.vod = vodinfo || {};
    ctx.body = videoinfo;
  }
};

//视频评论
exports.comment = async (ctx) => {
  //获取视频ID
  const videoId = ctx.request.params.videoid;
  const { content = '' } = ctx.request.body;
  const userId = ctx.user.userInfo._id;

  let videoInfo = await Video.findById(videoId);
  if (videoInfo) {
    let commentModel = new Videocomment({
      content,
      video: videoId,
      user: userId,
    });
    let dbBack = await commentModel.save();
    if (dbBack) {
      videoInfo.commentCount++;
      await videoInfo.save();
      //redis hot + 2
      ctx.body = { msg: '评论成功!' };
    } else {
      ctx.throw(501, '评论失败!');
    }
  } else {
    ctx.throw(404, '视频不存在');
  }
};
