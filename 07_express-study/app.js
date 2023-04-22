var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let videoRouter = require("./routes/video");

var app = express();
app.disable('x-powered-by')

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use((req, res, next) => {
  console.log(`${req.method},${req.url},${Date.now()}`);
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//特殊请求
app.all("/xx", (req, res) => {
  res.send("123");
});
// app.get("/us?er", (req, res) => {
//   res.send(`${req.method}--- ${req.url}`);
// });
app.get("/user/:id",(req,res) => {
  console.log(req.params);
  // res.send(`${req.method}---${req.url}`)
  // res.download()
  res.download('./public/images/1.pdf', 'report.pdf')
})
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/video", videoRouter);
// app.get("/user",(req,res,next) => {
//   // res.send("/user")
//   console.log(789);
//   next()
// },(req,res) => {
//   res.send("/user")
// })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err.status);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
