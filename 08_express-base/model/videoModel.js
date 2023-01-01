const mongoose = require("mongoose");

const baseModel = require("./baseModel");
const videoSchema = new mongoose.Schema({
  //视频标题
  title: {
    type: String,
    required: true,
  },
  //视频描述
  descrption: {
    type: String,
    required: false,
  },
  vodvideoId:{
    type:String,
    required:true
  },
  user:{
    type:mongoose.Mixed,
    required:true,
    ref:"User"
  },
  //封面
  cover:{
    type:String,
    required:false
  },
  ...baseModel,
});

module.exports = videoSchema;
