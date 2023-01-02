const mongoose = require("mongoose")
const baseModel = require("./baseModel")
const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        required:true,
        ref:"User"
    },
    video:{ //那个视频
        type:mongoose.ObjectId,
        required:true,
        ref:"Video"
    },
    like:{
        type:Number,
        enum:[1,-1],
        required:true
    },
  ...baseModel

})

module.exports = likeSchema