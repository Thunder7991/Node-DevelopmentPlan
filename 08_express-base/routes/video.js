var express = require("express");
var router = express.Router();
const videoController = require("../controller/videoController");
const vodController = require("../controller/vodController");
const { verifyToken } = require("../util/jwt");
const { videoValidator } = require("../middleware/validator/videoValidator");
router
  .get("/videolist", verifyToken(), videoController.videolist)
  .get("/detail/:videoId", verifyToken(), videoController.video)
  .get("/getvod", verifyToken(), vodController.getvod)
  .post(
    "/createvideo",
    verifyToken(),
    videoValidator,
    videoController.createVideo
  )
  //视频评论
  .post("/comment/:videoId", verifyToken(), videoController.comment)
  //视频评论列表
  .get("/commentlist/:videoId", verifyToken(), videoController.commentlist)
  // 删除评论
  .delete(
    "/comment/:videoId/:commentId",
    verifyToken(),
    videoController.delcomment
  )
  //like or unlike
  .get("/like/:videoId", verifyToken(), videoController.like)
  .get("/dislike/:videoId", verifyToken(), videoController.dislike);


module.exports = router;
