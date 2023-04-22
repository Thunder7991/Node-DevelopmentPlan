const Koa = require('koa');
const router = require('./rotuer');
const { koaBody } = require('koa-body');
const app = new Koa();
// app.use(async ctx => {
//     if (ctx.path === "/user") {

//     }else if (ctx.path === "/video") {

//     }
// })

app.use(koaBody());

app.use(router.routes());

app.on('error', (err, ctx) => {
  console.log(err);
  ctx.body= err
});
app.listen(300, () => {
  console.log('http://127.0.0.1:300');
});
