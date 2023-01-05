const Redis = require("ioredis");
const redis = new Redis({
  port: 6379,
  host: "192.168.148.128",
  lazyConnect: true,
});

redis.set("mykey", "value");
