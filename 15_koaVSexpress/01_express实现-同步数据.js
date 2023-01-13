const express = require('express');

const app = express();

const middleware1 = (req, res, next) => {
  console.log(1);
  req.message = 'aaa';
  next();
  console.log(2);

  res.end(req.message);
};

const middleware2 = (req, res, next) => {
  console.log(3);

  req.message += 'bbb';
  next();
  console.log(4);
};

const middleware3 = (req, res, next) => {
  console.log(5);

  req.message += 'ccc';
  console.log(6);
};

app.use(middleware1, middleware2, middleware3);

app.listen(8000, () => {
  console.log('服务器启动成功~');
});
