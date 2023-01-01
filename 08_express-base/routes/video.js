var express = require("express");
var router = express.Router();
const videoController = require("../controller/videoController");
const vodController = require("../controller/vodController");
const { verifyToken } = require("../util/jwt");
const  {videoValidator} = require("../middleware/validator/videoValidator");
router
  .get("/lists", videoController.list)
  .get("/getvod", vodController.getvod)
  .post("/createvideo", verifyToken, videoValidator, videoController.createVideo)

module.exports = router;
