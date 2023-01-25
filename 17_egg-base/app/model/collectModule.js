const baseModel = require('./baseModel');
module.exports = app => {
  // 收藏
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const collectSchema = new Schema({
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
    },
    video: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'video',
    },
    ...baseModel,
  });
  return mongoose.model('Collect', collectSchema);
};
