/**
 * 默认配置
 */

module.exports.uuid = '4a380a09-3aab-401b-a620-1372b7e8c77a'
module.exports.mongopath = 'mongodb://192.168.148.128:27017/express-video'
module.exports.redisClient = {
    host: "192.168.148.128",
    port: 6379,
    password: "root",
    lazyConnect: true,
    connectTimeout: 5000,

}