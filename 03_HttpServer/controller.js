let fs = require('fs');
module.exports = {
    index(res){
        //处理主页信息返回
        fs.readFile('./index.html', 'utf-8', (err, data) => {
            res.write(data);
            res.end();
          });
    },
    user(postData) {
        //业务逻辑代码
      console.log(postData);
    }
}