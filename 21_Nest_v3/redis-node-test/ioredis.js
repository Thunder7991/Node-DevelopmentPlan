/*
 * @Author: thunderchen
 * @Date: 2023-07-29 17:41:27
 * @LastEditTime: 2023-07-29 17:41:30
 * @email: 853524319@qq.com
 * @Description: ioredis
 */

import Redis from "ioredis"

const redis = new Redis()

const res = await redis.keys("*")

console.log(res);