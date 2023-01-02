const { json } = require("express");
const { Video, Videocomment } = require("../model/index");

exports.videolist = async (req, res) => {
  let { pageNum = 1, pageSize = 10 } = req.body;
  let getVideoList = await Video.find()
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({createAt:-1})
    .populate('user','_id username cover')
    //获取数据条数
   const total = await Video.countDocuments()
   res.status(200).json({data:getVideoList,total})

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

exports.video = async(req,res) => {
    const {videoId} = req.params
   let videoInfo = await Video
   .findById(videoId)
   .populate('user','_id username cover')
    res.status(200).json(videoInfo)
}

exports.comment = async(req,res) => {
  const {videoId} = req.params
 const videoInfo =  await Video.findById(videoId)
 //添加新的数据
 if (!videoInfo) {
  return res.status(404).json({
    err:"视频不存在"
  })
 }
 const comment =  await new Videocomment({
    content:req.body.content,
    video:videoId,
    user:req.user.userinfo._id,

  }).save()
  //评论数量 + 1
  videoInfo.commentCount++ 
 await videoInfo.save()
 res.status(201).json(comment)



}
