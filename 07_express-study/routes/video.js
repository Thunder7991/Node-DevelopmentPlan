var express = require('express');
var router = express.Router();
router.get("/list",(req,res) => {
    console.log(req.method);
    res.send("/video-list")
})



module.exports = router

