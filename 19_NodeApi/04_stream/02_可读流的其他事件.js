
const fs = require('fs');

const readStream = fs.createReadStream('./test.txt', {
  start: 8,
  end: 20,
  highWaterMark: 3,
});

readStream.on('data', (data) => {
  console.log(data.toString());
});

readStream.on("open",(fd)=>{
    console.log("通过流将文件打开",fd);
})

readStream.on("end",() =>{
  console.log("已经读取到end位置");  

  
})


readStream.on("close",() =>{
    console.log("文件读取结束,并且被关闭!");
})