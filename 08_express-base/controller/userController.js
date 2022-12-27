const { User } = require("../model/index");

exports.list = async (req, res, next) => {
  res.send("respond with a resource");
};

exports.delete = async (req, res) => {};

exports.register = async (req, res) => {
  const userModel = new User(req.body);
  const dbBack = await userModel.save();
  user = dbBack.toJSON()
  delete user.password
  res.status(201).json({user});
};
