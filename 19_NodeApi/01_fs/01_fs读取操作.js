const fs = require('fs');
//1. 同步读取
const res1 = fs.readFileSync('./abc.txt', {
  encoding: 'utf-8',
});
console.log(res1);
//2. 异步读取 回调函数

fs.readFile(
  './abc.txt',
  {
    encoding: 'utf-8',
  },
  (error, data) => {
    if (error) {
      console.log('读取文件错误', error);
      return;
    }
    console.log(data);
  },
);
console.log('后续代码');
// *************************异步读取方式打印结果***************
// 后续代码
// /*
//  * @Author: thunderchen
//  * @Date: 2023-02-26 17:35:01
//  * @LastEditTime: 2023-02-26 17:35:28
//  * @email: 853524319@qq.com
//  * @Description:
//  */

//3. 异步读取, promise
fs.promises
  .readFile('./abc.txt', {
    encoding: 'utf-8',
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

  