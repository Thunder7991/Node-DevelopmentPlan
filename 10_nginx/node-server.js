/*
 * @Author: thunderchen
 * @Date: 2023-01-10 21:51:37
 * @LastEditTime: 2023-01-10 22:23:13
 * @email: 853524319@qq.com
 * @description: 反向代理
 */
let http = require('http');
let server = http.createServer();
server.listen(3000, () => {
  console.log(12123);
});
server.on('request', (req, res) => {
  if (req.url == '/') {
    res.end('node-server');
  } else {
    res.end('other path node-server');
  }
});

/**
 * nginx 配置:
 */

// location /test {
//     proxy_pass HTTP://127.0.0.1:3000;
//     }
