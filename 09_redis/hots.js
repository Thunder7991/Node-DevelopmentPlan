const Redis = require("ioredis");
// 'redis://192.168.148.128:6379',
const redis = new Redis({
  host: "192.168.148.128",
  port: 6379,
  password: "root",
  lazyConnect: true,
  connectTimeout: 5000,
});

//实现排名 有序集合

var num = Math.round(Math.random() * 30 + 1);
let str = "abcdefghigklmn";
let strtap = Math.round(Math.random() * 11 + 0);
console.log(strtap);
async function jihe() {
  let data = await redis.zscore("hots", str[strtap]);
  if (data) {
    await redis.zincrby("hots", 1, str[strtap]);
    console.log(str[strtap] + "+1");
  } else {
    let write = await redis.zadd("hots", num, str[strtap]);
    console.log("写入", str[strtap] + write);
  }
  //0 -1 获取所有的元素
  let paixu = await redis.zrevrange("hots", 0, -1, "withscores");
  console.log(paixu);
  let obj = {};
  for (let i = 0; i < paixu.length; i++) {
    if (i % 2 == 0) {
      obj[paixu[i]] = paixu[i + 1];
    }
  }
  console.log(obj);
}

jihe();
