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

  .get("/lists", verifyToken, userController.list)
  //修改用户信息
  .put("/", verifyToken, validator.update, userController.update)
  //上传文件
  .post("/headimg", verifyToken,upload.single('headimg'), userController.headimg)

  .delete("/", userController.delete);

module.exports = router;
