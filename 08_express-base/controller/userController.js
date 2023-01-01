const { User, Subscribe } = require("../model/index");
const { createToken } = require("../util/jwt");
const fs = require("fs/promises");
const { pick } = require("lodash");
const rename = fs.rename;

exports.delete = async (req, res) => {};
//用户注册
exports.register = async (req, res) => {
  const userModel = new User(req.body);
  const dbBack = await userModel.save();
  user = dbBack.toJSON();
  delete user.password;
  res.status(201).json({ user });
};

//用户登录
exports.login = async (req, res) => {
  // 客户端数据验证

  //链接数据库进行查询
  console.log(req.body);
  let dbBack = await User.findOne(req.body);
  console.log(dbBack);
  if (!dbBack) {
    res.status(402).json({ error: "邮箱或者密码不正确" });
  }
  console.log(dbBack);
  dbBack = dbBack.toJSON();
  dbBack.token = await createToken(dbBack);
  res.status(200).json(dbBack);
};
//用户修改
exports.update = async (req, res) => {
  // res.send(req.body)
  let id = req.user.userinfo._id;
  console.log(id);
  let updateData = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  console.log(updateData);
  // res.send(req.body);
  res.status(202).json({ user: updateData });
};
//用户头像上传
exports.headimg = async (req, res) => {
  console.log(req.file);
  // {
  //   fieldname: 'headimg',
  //   originalname: '微信图片_20220907143746.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: 'public/images',
  //   filename: 'eea6e916e54e8102f5a8dc75f81fdfec',
  //   path: 'public\\images\\eea6e916e54e8102f5a8dc75f81fdfec',
  //   size: 3417070
  // }
  let fileArr = req.file.originalname.split(".");
  let fileType = fileArr[fileArr.length - 1];
  let filename = req.file.filename;

  try {
    await rename(
      "./public/images/" + filename,
      "./public/images/" + filename + "." + fileType
    );
    res.status(201).json({
      filename,
      filepath: filename + "." + fileType,
    });
  } catch (error) {
    res.status(500).json({
      err: error,
    });
  }
};
exports.list = async (req, res, next) => {
  console.log(req);
  res.send("respond with a resource");
};

//用户订阅 关注
exports.subscribe = async (req, res) => {
  const userId = req.user.userinfo._id;
  const channelId = req.params.userId;
  console.log(userId === channelId);
  if (userId === channelId) {
    return res.status(401).json({ err: "不能关注自己" });
  }
  //获取记录
  let record = await Subscribe.findOne({
    user: userId,
    channel: channelId,
  });

  if (!record) {
    await new Subscribe({
      user: userId,
      channel: channelId,
    }).save();

    const user = await User.findById(channelId);
    user.subscribeCount++;
    await user.save();
    res.status(200).json({ msg: "关注成功!" });
  } else {
    res.status(401).json({
      err: "已经订阅此频道",
    });
  }
};

//取消订阅
exports.unsubscribe = async (req, res) => {
  const userId = req.user.userinfo._id;
  const channelId = req.params.userId;
  console.log(userId === channelId);
  if (userId === channelId) {
    return res.status(401).json({ err: "不能取消关注自己" });
  }
  //判断是否关注过
  let record = await Subscribe.findOne({
    user: userId,
    channel: channelId,
  });

  if (record) {
    await record.remove();

    const user = await User.findById(channelId);
    user.subscribeCount--;
    await user.save();
    res.status(200).json({ msg: "取消关注成功" });
  } else {
    res.status(401).json({
      err: "没有订阅此频道",
    });
  }
};

//获取频道详情
exports.getChannel = async (req, res) => {
  let isSubscribe = false;
  if (req.user) {
    const record = await Subscribe.findOne({
      channel: req.params.userId, //查找的用户是否关注过
      user: req.user.userinfo._id,
    });
    if (record) {
      isSubscribe = true;
    }
  }
  const user = await User.findById(req.params.userId);
  user.isSubscribe = isSubscribe;
  res.status(200).json({
    user: pick(user, [
      "_id",
      "username",
      "image",
      "subscribeCount",
      "channeldes",
      "cover",
    ]),
    isSubscribe,
  });
};
//获取关注列表
exports.getsubscribelist = async(req,res) => {
 let subscribeList =  await Subscribe.find({
    user:req.params.userId
  }).populate("channel")
  subscribeList = subscribeList.map(item => {
   return pick(item.channel,[
      "_id",
      "username",
      "image",
      "subscribeCount",
      "channeldes",
      "cover",
    ])
  })
  res.status(200).json({data:subscribeList})
}
//获取粉丝列表
exports.getfanslist = async(req,res) => {
  let fansList =  await Subscribe.find({
    channel:req.user.userinfo._id
   }).populate("user")
   fansList = fansList.map(item => {
    return pick(item.user,[
       "_id",
       "username",
       "image",
       "subscribeCount",
       "channeldes",
       "cover",
     ])
   })
   res.status(200).json({data:fansList})
 }