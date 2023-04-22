const Redis = require('ioredis');

const redis = new Redis(6379, '192.168.148.128', {
  password: 'root',
});

redis.on('error', err => {
  if (err) {
    console.log('Redis 链接错误');
    redis.quit();
  }
});


redis.on('ready', () => {
  console.log('redis 链接成功!');
});

module.exports.redis = redis;
