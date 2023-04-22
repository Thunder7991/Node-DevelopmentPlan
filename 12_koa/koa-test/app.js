const Koa =require('koa')

const app = new Koa()
app.use(async ctx => {
    // ctx.body = "hello koa"
    let method = ctx.req.method
    let url = ctx.req.url
    console.log(method);
    console.log(url);

})

app.listen(300,() => {
    console.log("http://127.0.0.1:300");
})