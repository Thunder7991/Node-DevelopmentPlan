const Controller = require('egg').Controller;

class VideoController extends Controller {
  // 创建评论
  async setcomment() {
    const { ctx, service } = this;
    const body = ctx.request.body;
    const videoid = ctx.params.videoid;
    ctx.validate(
      {
        content: { type: 'string' },
      },
      body
    );

    const { VideoModel, VideoCommentModel } = this.app.model;
    const video = await VideoModel.findById(videoid);
    if (!video) {
      ctx.throw(404, '视频不存在!');
    }
    // 添加新评论
    const comment = await new VideoCommentModel({
      content: body.content,
      user: ctx.user._id,
      video: videoid,
    }).save();
    if (comment) {
      video.commentCount = await VideoModel.countDocuments({
        video: videoid,
      });
      await video.save();
      // 添加热度
      service.redishot.hotInc(videoid, 2);
      ctx.body = {
        msg: '评论成功',
      };
    } else {
      ctx.throw(501, '视频评论失败!');
    }
  }
}

module.exports = VideoController;
