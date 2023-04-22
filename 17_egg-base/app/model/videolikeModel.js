const baseModel = require('./baseModel');
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const likeSchema = new Schema({
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
    },
    video: { // 那个视频
      type: mongoose.ObjectId,
      required: true,
      ref: 'Video',
    },
    like: {
      type: Number,
      enum: [ 1, -1 ],
      required: true,
    },
    ...baseModel,

  });
  return mongoose.model('Like', likeSchema);
};

