const baseModel = require('./baseModel');
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const videoSchema = new Schema({
    // 视频标题
    title: {
      type: String,
      required: true,
    },
    // 视频描述
    descrption: {
      type: String,
      required: false,
    },
    vodvideoId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Mixed,
      required: true,
      ref: 'User',
    },
    // 封面
    cover: {
      type: String,
      required: false,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      default: 0,
    },
    ...baseModel,
  });
  return mongoose.model('Video', videoSchema);
};
