/*
 * @Author: thunderchen
 * @Date: 2023-07-29 16:04:35
 * @LastEditTime: 2023-07-29 17:41:04
 * @email: 853524319@qq.com
 * @Description:  redis 基础使用
 */
import {createClient}  from "redis"

const client = createClient({
    socket:{
        host:"localhost",
        port:6379
    }
})

client.on('error',(err)=> console.log('redis client error',err))

await client.connect()

const value = await client.keys('*')

console.log(value);

// hset 创建一个 hash 表：
await client.hSet("clearlove","111","value111")
await client.hSet("clearlove","222","value222")
await client.hSet("clearlove","333","value333")




await client.disconnect()

