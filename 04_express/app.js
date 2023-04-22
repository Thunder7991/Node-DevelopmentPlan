const express = require('express');
const fs = require('fs');
const db = require('./db');
const { promisify } = require('util');
const app = express();
//处理 x-www-form-urlencoded 数据类型
// app.use(express.urlencoded())
//处理json 数据格式
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    let back = await db.getDb();
    res.send(back.name);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post('/', async (req, res) => {
  let body = req.body;
  if (!body) {
    res.status(403).json({
      error: '缺少用户信息',
      data: null,
      code: 4003,
    });
  }
  //获取所有用户数据
  let jsonObj = await db.getDb();
  body.id = jsonObj.users[jsonObj.users.length - 1].id + 1;
  jsonObj.users.push(body);
  try {
    let w = await db.serveDb(jsonObj);
    if (!w) {
      res.status(200).send({
        message: '判断成功！',
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

app.put('/:id', async (req, res) => {
  try {
    let userInfo = await db.getDb();
    let userId = Number.parseInt(req.params.id);
    let user = userInfo.users.find((item) => itemid.id === userId);
    if (!user) {
      res.status(403).json({
        error: '用户不存在',
      });
    }
    res.send(user);
    const body = req.body;
    user.username = body.username ? body.username : user.username;
    user.age = body.age ? body.age : user.age;
    userInfo.users[userId - 1] = user;

    if (!(await db.serveDb(userInfo))) {
      res.status(201).json({
        msg: '信息修改成功~',
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(3000, () => {
  console.log('open: http://localhost:3000');
});
