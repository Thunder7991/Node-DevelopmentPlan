var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");

const validator = require("../middleware/validator/userValidator");
const { verifyToken } = require("../util/jwt");
const multer = require('multer')
const upload =  multer({dest:'public/images'})

/* GET users listing. */
router
  .post("/registers", validator.register, userController.register)
  .post("/logins", validator.login, userController.login)

  .get("/lists", verifyToken(), userController.list)
  //修改用户信息
  .put("/", verifyToken(), validator.update, userController.update)
  //上传文件
  .post("/headimg", verifyToken(),upload.single('headimg'), userController.headimg)

  .delete("/", userController.delete)
  //订阅
  .get("/subscribe/:userId", verifyToken(),userController.subscribe)
  //取消订订阅
  .get("/unsubscribe/:userId", verifyToken(),userController.unsubscribe)
  //获取频道信息
  .get("/getchannel/:userId", verifyToken(false),userController.getChannel)
  //获取关注列表
  .get("/getsubscribelist/:userId",verifyToken(false),userController.getsubscribelist)
  //获取粉丝列表
  .get("/getfanslist/:userId",verifyToken(false),userController.getfanslist)




module.exports = router;
