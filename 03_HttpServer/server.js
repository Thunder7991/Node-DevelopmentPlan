let http = require('http');

let router = require('./router');
let server = http.createServer();
server.listen(9999, () => {
  console.log('http://localhost:9999');
});

server.on('request', function (req, res) {
  router(req, res);
});
