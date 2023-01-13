const Koa = require('koa');
const axios = require('axios');

const app = new Koa();

const middleware1 = async (ctx, next) => {
  ctx.message = "aaa";
  await next();
  
  ctx.body = ctx.message;
}

const middleware2 = async (ctx, next) => {
  ctx.message += "bbb";
  await next();
}

const middleware3 = async (ctx, next) => {
  const result = await axios.get('******');
  ctx.message += result.data.lrc.lyric;
}

app.use(middleware1);
app.use(middleware2);
app.use(middleware3);

app.listen(8000, () => {
  console.log("服务器启动成功~");
})