const { User } = require("../model/index");

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
  let dbBack = await User.findOne(req.body);
  res.status(200).json(dbBack);
};

exports.list = async (req, res, next) => {
  res.send("respond with a resource");
};
