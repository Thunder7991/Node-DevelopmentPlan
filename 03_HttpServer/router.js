let fs = require('fs');
let url = require('url');
let controller = require("./controller")
module.exports = (req,res) => {
    let reqMethod = req.method;
    if (reqMethod === 'GET') {
      let parseUrl = url.parse(req.url, true);
      console.log(parseUrl);
      if (req.url === '/') {
        controller.index(res)
      } else {
        fs.readFile('./abc.png', function (err, data) {
          res.end(data);
        });
      }
    } else if (reqMethod === 'POST') {
      // 请求体
  
      //监听数据
      let data = '';
      req.on('data', function (d) {
        // console.log(d);
        data += d;
      });
      req.on('end', function () {
        //处理用户信息 controller
        // let queryParse = require('querystring').parse(postData);
        controller.user(require('querystring').parse(postData),res)
      });
      res.end();
    }
}