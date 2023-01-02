const { json } = require("express");
const { Video, Videocomment } = require("../model/index");

exports.videolist = async (req, res) => {
  let { pageNum = 1, pageSize = 10 } = req.body;
  let getVideoList = await Video.find()
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ createAt: -1 })
    .populate("user", "_id username cover");
  //获取数据条数
  const total = await Video.countDocuments();
  res.status(200).json({ data: getVideoList, total });
};

exports.createVideo = async (req, res) => {
  let body = req.body;
  body.user = req.user.userinfo;
  const videoModel = new Video(req.body);
  try {
    let dbBack = await videoModel.save();
    res.status(201), json({ dbBack });
  } catch (error) {
    res.status(500), json({ error });
  }

  res.send(req.body);
};

exports.video = async (req, res) => {
  const { videoId } = req.params;
  let videoInfo = await Video.findById(videoId).populate(
    "user",
    "_id username cover"
  );
  res.status(200).json(videoInfo);
};

exports.comment = async (req, res) => {
  const { videoId } = req.params;
  const videoInfo = await Video.findById(videoId);
  //添加新的数据
  if (!videoInfo) {
    return res.status(404).json({
      err: "视频不存在",
    });
  }
  const comment = await new Videocomment({
    content: req.body.content,
    video: videoId,
    user: req.user.userinfo._id,
  }).save();
  //评论数量 + 1
  videoInfo.commentCount++;
  await videoInfo.save();
  res.status(201).json(comment);
};

//评论列表
exports.commentlist = async (req, res) => {
  const videoId = req.params.videoId;
  const { pageNum = 1, pageSize = 10 } = req.body;
  try {
    const comments = await Videocomment.find({ video: videoId })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate("user", "_id username image");
    const commentCount = await Videocomment.countDocuments({ video: videoId });
    res.status(200).json({ data: comments, count: commentCount });
  } catch (error) {
    res.status(500).json({ error: "服务器异常!" });
  }
};

//删除评论
exports.delcomment = async (req, res) => {
  // 获取ID
  const { videoId, commentId } = req.params;
  try {
    const videoInfo = await Video.findById(videoId);
    if (!videoInfo) {
      return res.status(404).json({
        err: "视频不存在",
      });
    }
    //获取评论Id
   const comment= await Videocomment.findById(commentId)
    if (!comment) {
      return res.status(404).json({
        err: "评论不存在",
      });
    }
    if (!comment.user.equals(req.user.userinfo._id) ) {
      return res.status(403).json({
        err: "评论不可删除!",
      });
    }
    //删除
    await comment.remove()
    //当前videoInfo数据 commentCount 数量减一

    videoInfo.commentCount--
    await videoInfo.save()
    res.status(200).json({
      msg: "删除成功!",
    });
  } catch (error) {
    return res.status(500).json({
      err: error,
    });
  }
};
