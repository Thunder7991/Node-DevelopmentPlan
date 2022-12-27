var express = require('express');
var router = express.Router();
const videoController = require("../controller/videoController")
router
.get("/list",videoController.list)



module.exports = router

