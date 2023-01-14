const router = require('koa-router')({
  prefix: '/api/v1'
})
const uerController = require("../controller/userController")

router.get('/user',uerController.index)



module.exports = router
