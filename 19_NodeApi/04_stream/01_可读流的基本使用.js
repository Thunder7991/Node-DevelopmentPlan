const fs = require('fs');

// 1. 一次性读取
// 缺点一:  没有办法精准控制从哪里读取 , 读取到什么位置
//缺点二: 无法读取到一个位置时, 暂停读取/恢复读取
//缺点三: 文件非常大的时候, 多次读取
// fs.readFile("./test.txt",(err,data) => {
//     console.log(data);
// })

//2. 通过流读取

//创建可读流 [8,20]
const readStream = fs.createReadStream('./test.txt', {
  start: 8,
  end: 20,
  highWaterMark: 3,
});

readStream.on('data', (data) => {
  console.log(data.toString());
  // che
  // n

  readStream.pause(); //暂停

  setTimeout(() => {
    readStream.resume();
  }, 2000);
});
