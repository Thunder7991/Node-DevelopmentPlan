const Router = require('@koa/router')
const router = new Router({ prefix: '/api/v1' })
const userController = require('../controller/userController')

const {registerValidate} = require("../middleware/userValidate")
router.get('/user/:userId', userController.index)
//用户注册
router.post('/user/register',registerValidate, userController.register)


module.exports = router;
