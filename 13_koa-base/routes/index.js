const Router = require('@koa/router');
const router = new Router({ prefix: '/api/v1' });
const userController = require('../controller/userController');

const {
  registerValidate,
  loginValidate,
} = require('../middleware/userValidate');
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


//获取关注列表
// router.get( verifyToken(true), userController.subscribeList);


module.exports = router;
