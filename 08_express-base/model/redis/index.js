/*
 * @Author: thunderchen
 * @Date: 2023-01-08 12:25:24
 * @LastEditTime: 2023-01-08 13:02:37
 * @email: 853524319@qq.com
 * @description: ***
 */

const Redis = require("ioredis");
const {redisClient} = require("../../config/config.default")

const redis = new Redis(redisClient);

redis.on('error',err => {
    if (err) {
        console.log("Redis链接错误");
        console.log(err);
        redis.quit()
    }
})

redis.on('ready',() => {
    console.log('Redis链接成功');
})

exports.redis = redis
