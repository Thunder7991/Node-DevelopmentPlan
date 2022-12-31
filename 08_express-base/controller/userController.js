const { User } = require("../model/index");
const { createToken } = require("../util/jwt");
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
  let updateData =await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  console.log(updateData);
  // res.send(req.body);
  res.status(202).json({ user: updateData });
};
exports.list = async (req, res, next) => {
  console.log(req);
  res.send("respond with a resource");
};
