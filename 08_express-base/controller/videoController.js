const { json } = require("express");
const { Video } = require("../model/index");

exports.videolist = async (req, res) => {
  let { pageNum = 1, pageSize = 10 } = req.body;
  //   console.log(req.method);
  //   res.send("/video-list");
  let getVideoList = await Video.find()
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({createAt:-1})
    // .populate('user')

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
