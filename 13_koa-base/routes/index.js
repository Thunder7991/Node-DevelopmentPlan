const Router = require('@koa/router');
const router = new Router({ prefix: '/api/v1' });
const userController = require('../controller/userController');

const {
  registerValidate,
  loginValidate,
} = require('../middleware/userValidate');
const { verifyToken } = require('../util/jwt');

router.get('/user/:userId', userController.index);
//用户注册
router.post('/user/register', registerValidate, userController.register);
router.post('/user/login', loginValidate, userController.login);
router.post('/user/getuser', verifyToken(true), userController.getuser);

module.exports = router;
