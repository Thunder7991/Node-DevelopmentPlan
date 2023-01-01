var express = require('express');
var router = express.Router();
const videoController = require("../controller/videoController")
const vodController = require('../controller/vodController')
router
.get("/lists",videoController.list)
.get("/getvod",vodController.getvod)

module.exports = router

