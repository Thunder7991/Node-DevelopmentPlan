const Router = require('@koa/router');
const router = new Router({ prefix: '/api/v1' });

router.get('/user', (ctx) => {
  ctx.body = 'userssss';
});

router.get('/video/:id', (ctx) => {
  console.log(ctx.query);
  console.log(ctx.params);
  ctx.body = 'video';
});
router.post('/user',ctx => {
    console.log(ctx.request);
})
router.post('/login/:id', (ctx) => {
    console.log(ctx.query);
    console.log(ctx.params);
    console.log(ctx.request.body);
    console.log(ctx);
    //处理错误
    // ctx.throw(400,"errmsg")
    JSON.parse('')

    ctx.body = 'video';
  });
module.exports = router;
