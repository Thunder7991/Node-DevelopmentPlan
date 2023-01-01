const { json } = require("express");
const { Video } = require("../model/index");

exports.list = async (req, res) => {
  console.log(req.method);
  res.send("/video-list");
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
