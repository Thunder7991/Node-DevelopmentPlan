const { User } = require("../model/index");
const { createToken } = require("../util/jwt");
const fs = require("fs/promises");
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
      filepath:filename + "." + fileType
    })
  } catch (error) {
    res.status(500).json({
      err:error
    })
  }
};
exports.list = async (req, res, next) => {
  console.log(req);
  res.send("respond with a resource");
};
