// 1. 方式一: 一次性读取和写入文件

const fs = require('fs');

fs.readFile('./foo.txt', (err, data) => {
  console.log(data);
  fs.writeFile('./foo_copy.txt', data, (err) => {
    console.log('写入文件完成', err);
  });
});

//方式二: 可读流和可写流

const readStream = fs.createReadStream("./foo.txt")
const writeStream = fs.createWriteStream("./foo_copy03.txt")

// readStream.on('data',(data) =>{
//     writeStream.write(data)
// })

// readStream.on('end',(data) =>{
//     writeStream.close()
// })
//第三种 可读流和可写流之间建立管道

readStream.pipe(writeStream)