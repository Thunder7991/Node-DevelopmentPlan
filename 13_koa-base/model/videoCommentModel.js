//视频评论模型

const mongoose = require("mongoose")
const baseModel = require("./baseModel")
const videoCommentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    video:{
        type:mongoose.ObjectId,
        required:true,
        ref:'Video'
    },

    user:{
        type:mongoose.ObjectId,
        required:true,
        ref:'User'
    },
   
  ...baseModel

})

module.exports = videoCommentSchema