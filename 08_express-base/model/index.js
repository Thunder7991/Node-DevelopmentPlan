const mongoose = require("mongoose");
const {mongopath}  = require('../config/config.default')
mongoose.set("strictQuery", false);
async function main() {
  await mongoose.connect(mongopath);
}
main()
  .then((res) => {
    console.log("mongo链接成功~");
  })
  .catch((err) => {
    console.log(err);
    console.log("mongo链接失败");
  });

  module.exports = {
    User:mongoose.model('User',require('./userModel.js')),
    Video:mongoose.model("Video",require('./videoModel.js')),
    Subscribe:mongoose.model("Subscribe",require('./subscribeModel.js')),
    Videocomment:mongoose.model("Videocomment",require('./videoCommentModel.js')),
    Like:mongoose.model("Like",require('./videolikeModel.js')),
    Collect:mongoose.model("Collect",require('./collectModule.js')),

    
  }

// //创建集合
// const user = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: Number,
//     required: true,
//   },
// });
// //操作模型 拿到结合
// const userModel = mongoose.model("User", user);
// const u = new userModel({
//   username: "thunder",
//   age: 18,
// });

// u.save()
