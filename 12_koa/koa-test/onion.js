// 洋葱模型

const Koa = require('koa');

const app = new Koa();
app.use(   (ctx, next) => {
  console.log('one - 1');
  next();

  console.log('one - 2');
});

app.use(async (ctx, next) => {
  console.log('tow - 1');
  next();
  console.log('tow - 2');
});

app.use(async (ctx, next) => {
  console.log('three - 1');
  next();
  console.log('three - 2');
});

app.listen(300, () => {
  console.log('http://127.0.0.1:300');
});
