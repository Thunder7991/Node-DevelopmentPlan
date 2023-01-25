const baseModel = require('./baseModel');
const { md5 } = require('../extend/helper');
module.exports = app => {

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      set: value => md5(value),
      select: false, // 查询过程中去掉password字段
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    // 当前用户频道信息
    cover: { // 封面
      type: String,
      default: null,
    },
    channeldes: { // 频道描述
      type: String,
      default: null,
    },
    subscribeCount: {
      type: Number,
      default: 0,
    },
    ...baseModel,
  });

  return mongoose.model('User', UserSchema);
};
