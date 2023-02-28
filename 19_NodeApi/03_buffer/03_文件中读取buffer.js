/*
 * @Author: thunderchen
 * @Date: 2023-02-27 22:51:16
 * @LastEditTime: 2023-02-27 22:55:01
 * @email: 853524319@qq.com
 * @Description: 
 */
const fs =require('fs')

fs.readFile("./test.txt",{encoding:"utf-8"},(err,data) =>{
    console.log(data);
})


fs.readFile("./test.txt",(err,data) =>{
    console.log(data.toString());
})


fs.readFile("./test.txt",(err,data) =>{
    data[0] = 0x6d
    console.log(data.toString());
})

//读取一张图片
fs.readFile("./my.png",(err,data) => {
    console.log(data);
})