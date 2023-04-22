let fs = require('fs');

fs.readFile('./a.txt', 'utf-8', (err, data) => {
  if (!err) {
    console.log(data);
    let newData = data + '888';
    fs.writeFile('./a.txt', newData, (err) => {
      if (!err) {
        console.log('追加成功');
      }
    });
  }
});
