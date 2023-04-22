const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://192.168.148.128:27017");

const clientFun = async function (c) {
  //链接
  await client.connect();
  //拿到数据库
  const db = client.db("mytest");
  //获取集合
  return db.collection(c);
};
const main = async () => {
  let cc = await clientFun("cc");
  //   let d = await cc.find({ username: "thunder" });
  // 添加
  //   let d = await cc.insertOne({ username: "chen" });
  // let d = await cc.insertMany([{ username: "chen",age:2000 }]);
  //查询
  //   let d = await cc.findOne({ age: { $gt: 15 } });
  //   let d = await cc.find({ age: { $gt: 15 } });
  //   console.log(await d.toArray());

  //修改
  // let d = await cc.updateOne({age:{$gt:15}},{$set:{username:"1666"}})
  // let d = await cc.updateMany({age:{$gt:15}},{$set:{username:"7777"}})

  // 删除
  let d = await cc.deleteOne({ age: { $lt: 10 } });
  let dgt = await cc.deleteOne({ age: { $gt: 50 } });
  let dm = await cc.deleteMany({ age: { $gt: 50 } });
  console.log(d);
};
 
main().finally(() => client.close());
