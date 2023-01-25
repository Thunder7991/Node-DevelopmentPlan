const { redis } = require('./redis');
const Service = require('egg').Service;

class RedisService extends Service {
  async hotInc(videoId, number) {
    const data = await redis.zscore('videohots', videoId);
    if (data) {
      await redis.zincrby('videohots', number, videoId);
    } else {
      await redis.zadd('videohots', number, videoId);
    }
  }

}

module.exports = RedisService;
