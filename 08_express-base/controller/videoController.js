const { json } = require("express");
const { Video, Videocomment, Like, Subscribe } = require("../model/index");
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
  videoInfo = videoInfo.toJSON();
  //没登录默认喜欢状态
  videoInfo.islike = false;
  videoInfo.isdislike = false;
  videoInfo.isSubscribe = false;
  //判断是否登录/显示喜欢等相关数据
  if (req.user.userinfo) {
    const userId = req.user.userinfo._id;
    if (await Like.findOne({ user: userId, video: videoId, like: 1 })) {
      videoInfo.islike = true;
    }

    if (await Like.findOne({ user: userId, video: videoId, like: -1 })) {
      videoInfo.isdislike = true;
    }
    if (
      await Subscribe.findOne({ user: userId, channel: videoInfo.user._id })
    ) {
      videoInfo.isSubscribe = true;
    }
  }
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
    const comment = await Videocomment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        err: "评论不存在",
      });
    }
    if (!comment.user.equals(req.user.userinfo._id)) {
      return res.status(403).json({
        err: "评论不可删除!",
      });
    }
    //删除
    await comment.remove();
    //当前videoInfo数据 commentCount 数量减一

    videoInfo.commentCount--;
    await videoInfo.save();
    res.status(200).json({
      msg: "删除成功!",
    });
  } catch (error) {
    return res.status(500).json({
      err: error,
    });
  }
};

//like or unlike
exports.like = async (req, res) => {
  //获取videoId ,
  const videoId = req.params.videoId;
  const userId = req.user.userinfo._id;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ err: "视频不存在" });
  }
  let doc = await Like.findOne({
    user: userId,
    video: videoId,
  });
  let islike = true;
  //如果有值,且是喜欢
  if (doc && doc.like === 1) {
    await doc.remove();
    islike = false;
  } else if (doc && doc.like === -1) {
    doc.like = 1;
    await doc.save();
  } else {
    await new Like({
      user: userId,
      video: videoId,
      like: 1,
    }).save();
  }

  let like = await Like.countDocuments({
    video: videoId,
    like: 1,
  });

  let dislike = await Like.countDocuments({
    video: videoId,
    like: -1,
  });
  video.likeCount = like;
  video.dislikeCount = dislike;
  await video.save();
  res.status(200).json({
    ...video.toJSON(),
    islike,
  });
};
//不喜欢

exports.dislike = async (req, res) => {
  //获取videoId ,
  const videoId = req.params.videoId;
  const userId = req.user.userinfo._id;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ err: "视频不存在" });
  }
  let doc = await Like.findOne({
    user: userId,
    video: videoId,
  });
  let isdislike = true;
  //如果有值,且是喜欢
  console.log(doc);
  if (doc && doc.like === -1) {
    await doc.remove();
  } else if (doc && doc.like === 1) {
    doc.like = -1;
    await doc.save();
    isdislike = false;
  } else {
    await new Like({
      user: userId,
      video: videoId,
      like: -1,
    }).save();
    isdislike = false;
  }

  let like = await Like.countDocuments({
    video: videoId,
    like: 1,
  });

  let dislike = await Like.countDocuments({
    video: videoId,
    like: -1,
  });
  video.likeCount = like;
  video.dislikeCount = dislike;
  await video.save();
  res.status(200).json({
    ...video.toJSON(),
    isdislike,
  });
};
//喜欢列表
exports.likelist = async (req, res) => {
  const { pageNum = 1, pageSize = 10 } = req.params;
  try {
    let likes = await Like.find({
      like: 1,
      user: req.user.userinfo._id,
    })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate("video", "_id title vodvideoId user");

    //获取数据数量
    let likeCount = await Like.countDocuments({
      like: 1,
      user: req.user.userinfo._id,
    });

    res.status(200).json({ data: likes, count: likeCount });
  } catch (error) {
    res.status(500).json({
      err: "服务器异常",
    });
  }
};

//修改视频描述信息
exports.editvideo = async (req, res) => {
  let userId = req.user.userinfo._id;
  //获取客户端返回的信息
  let { videoId = "", descrption = "" } = req.body;
  if (!videoId) {
    return res.status(400).json({
      err: "视频标识异常!",
    });
  }
  //修改数据库信息
  let editVideoInfo = await Video.findByIdAndUpdate(videoId, req.body, {
    new: true,
  });
  res.status(200).json({
    msg: "修改成功!",
  });
};

//删除视频
exports.delvideo = async (req, res) => {
  //获取用户ID
  let id = req.user.userinfo._id;
  //获取视频ID
  let videoId = req.params.videoId;

  if (!videoId) {
    return res.status(400).json({
      err: "请求参数异常!",
    });
  }

  try {
    let videoItem = await Video.findById(videoId).exec()
    if (!videoItem) {
      throw new Error("当前视频异常")
    }
    //传输阿里云视频
    var client = initVodClient(
      "LTAI5t9E91CjMewUdCZD79Vt",
      "88888888888888888888"
    );
    let aliResult = await client.request(
      "DeleteVideo",
      {
        VideoIds: videoItem.vodvideoId,
      },
      {}
    );
    await Video.findByIdAndDelete(videoId)
    res.status(200).json({
      msg:"删除成功"
    })
  } catch (error) {
    if (error.message) {
      res.status(500).json({ err: error.message });
    } else {
      res.status(500).json({ err: error });
    }
  }

  //删除视频
  // await Video.findByIdAndDelete(videoId,)
};
