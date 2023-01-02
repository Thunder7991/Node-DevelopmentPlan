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
  .post("/comment/:videoId", verifyToken(), videoController.comment);

module.exports = router;
