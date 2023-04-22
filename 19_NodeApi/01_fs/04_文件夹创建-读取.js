const fs = require('fs');
//  fs.mkdir("./thunder",(err) => {
//     console.log(err);
//  })

//读取文件夹中 , 获取文件夹中的字符串数组
fs.readdir('./thunder', (err, files) => {
  console.log(files);
});
//读取文件夹,获取到文件夹中文件的信息
fs.readdir('./thunder', { withFileTypes: true }, (err, files) => {
  // console.log(files);
  files.forEach((item) => {
    if (item.isDirectory()) {
      console.log('是一个文件夹', item.name);
      //递归
    } else {
      console.log('是一个文件:', item.name);
    }
  });
});

//递归读取文件夹中所有文件
function readDirectory(path) {
  fs.readdir(path, { withFileTypes: true }, (err, files) => {
    files.forEach((item) => {
      if (item.isDirectory()) {
        readDirectory(`${path}/${item.name}`);
      } else {
        console.log('获取到文件', item.name);
      }
    });
  });
}
readDirectory("./thunder")
