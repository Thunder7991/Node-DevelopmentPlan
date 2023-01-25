// 视频评论模型
const baseModel = require('./baseModel');
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const videoCommentSchema = new Schema({
    content: {
      type: String,
      required: true,
    },
    video: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Video',
    },

    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
    },

    ...baseModel,

  });
  return mongoose.model('VideoComment', videoCommentSchema);
};

