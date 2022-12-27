var express = require('express');
var router = express.Router();
/* GET home page. */
router.use("/user",require("./users"))
router.use("/video",require('./video'))

module.exports = router;
