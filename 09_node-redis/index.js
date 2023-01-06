const Redis = require("ioredis");
// 'redis://192.168.148.128:6379',
const redis = new Redis({
  host: "192.168.148.128",
  port: 6379,
  password: "root",
  lazyConnect: true,
  connectTimeout: 5000,
});

redis.set("mykey", "value");

// 链接异常
// Unhandled error event: Error: connect ETIMEDOUT
/**
 * 设置密码:
 * redis-cli //进入redis 服务
 * config get requirepass 打印密码,发现暂无密码
 *
 * 添加密码:
 * config set requirepass root //设置密码为 root
 *
 * 此时需要退出redis服务
 * 使用密码进行链接
 * redis-cli -a root
 *
 * config get requirepass
 *
 * //此时可以正确获取密码
 *
 * 继续
 *
 * 修改redis的配置文件, 我的是 6379.conf
 *
 * vim /etc/redis/6379.conf
 *
 * 添加
 *
 * bind *
 *
 * 添加密码
 *
 * requirepass root
 * 
 * 重启redis
 * sudo systemctl restart redis_6379
 * 
 * 查看端口运行情况
 * netstat -tunlp  | grep 6379
 * 
 * 以后在链接redis,使用 
 * redis-cli -a root
 * 
 */
