const express = require('express');
const axios = require('axios');
const app = express();

const middleware1 = async (req, res, next) => {
  req.message = 'aaa';
  console.log(123);
   next();
  console.log(456);
  res.end(req.message);
};

const middleware2 = async (req, res, next) => {
  req.message += 'bbb';
  console.log(789);
   next();
  console.log(101112);
};

const middleware3 = async (req, res, next) => {
  const result = await axios.get('***');
  console.log(131415);
  req.message += 10;
  console.log(161718);
};

app.use(middleware1, middleware2, middleware3);

app.listen(8000, () => {
  console.log('服务器启动成功~');
});
