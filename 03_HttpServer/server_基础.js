let http = require('http');
let fs = require("fs")
let server = http.createServer();
server.listen(9999, () => {
  console.log('http://localhost:9999');
});

server.on('request', function (req, res) {
//   console.log('555');
//   res.setHeader('Content-type', 'text/plain;charset=utf-8');
//   res.write('333');

if (req.url === '/') {
    fs.readFile("./index.html","utf-8",(err,data) => {
        res.write(data)
      res.end();
    
    })
}else {
    fs.readFile("./abc.png",function (err,data) {
        res.end(data)
    })
}


});
