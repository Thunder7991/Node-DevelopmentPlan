const baseModel = require('./baseModel');
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const subscribeSchema = new Schema({
    // 用户
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
    },
    channel: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User',
    },
    ...baseModel,
  });
  return mongoose.model('Subscribe', subscribeSchema);

};
