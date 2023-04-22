const Router = require('@koa/router');
const router = new Router({ prefix: '/api/v1' });
const userController = require('../controller/userController');
const vodController= require("../controller/vodController")
const videoController = require("../controller/videoController")

const {
  registerValidate,
  loginValidate,
} = require('../middleware/userValidate');
const {videoValidator} = require("../middleware/videoValidator")
const {} = require("../middleware/videoValidator")
const { verifyToken } = require('../util/jwt');

// router.get('/user/:userId', userController.index);
//用户注册
router.post('/user/register', registerValidate, userController.register);
router.post('/user/login', loginValidate, userController.login);
//获取用户信息(频道)
router.get('/user/getuser/:userid', verifyToken(false), userController.getuser);
//关注用户
router.get('/user/subscribe/:subscribeid', verifyToken(true), userController.setSubscribe);


router.get('/user/subscribelist', verifyToken(true), userController.subscribeList);

//视频管理模块 
//'获取视频凭证
router.get('/video/getvod', verifyToken(true), vodController.getvod);
//视频入库
router.post('/video/createvideo', verifyToken(true),videoValidator, videoController.createVideo);
//获取播放地址
router.get("/video/getPlayer",verifyToken(false),vodController.getPlayer)
//获取视频列表
router.get("/video/videoList/:userid",verifyToken(false),videoController.videoList)
//获取视频详情
router.get("/video/getvideodetail/:videoid",verifyToken(false),videoController.getvideodetail)
// 视频评论
router.post("/video/comment/:videoid",verifyToken(true),videoController.comment)



module.exports = router;
