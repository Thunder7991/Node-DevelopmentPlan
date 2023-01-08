/*
 * @Author: thunderchen
 * @Date: 2023-01-08 13:03:34
 * @LastEditTime: 2023-01-08 13:26:45
 * @email: 853524319@qq.com
 * @description: 热度增长
 */

const { redis } = require("./index");
exports.hotInc = async (videoId, incNum) => {
  let data = await redis.zscore("videohots", videoId);
  let inc = null;
  if (data) {
    inc = await redis.zincrby("videohots", incNum, videoId);
  } else {
    inc = await redis.zadd("videohots", incNum, videoId);
  }
  return inc;
};
