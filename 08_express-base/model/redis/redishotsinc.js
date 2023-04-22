/*
 * @Author: thunderchen
 * @Date: 2023-01-08 13:03:34
 * @LastEditTime: 2023-01-08 13:58:37
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

exports.topHots = async (num) => {
  //获取全部
  let paixu = await redis.zrevrange("videohots", 0, -1, "withscores");
  let newArr = paixu.slice(0, num * 2);
  let obj = {};
  for (let i = 0; i < newArr.length; i++) {
    if (i % 2 == 0) {
      obj[newArr[i]] = newArr[i + 1];
    }
  }

  return obj;
};
