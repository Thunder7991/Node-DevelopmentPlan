/*
 * @Author: thunderchen
 * @Date: 2023-02-26 19:07:59
 * @LastEditTime: 2023-02-26 20:44:15
 * @email: 853524319@qq.com
 * @Description: 文件的读写
 */
// readFile: 读取文件的内容 / writeFile: 写入文件的内容


const fs = require("fs")
const content = "hello thunder chen"

//2. 文件的写入操作
fs.writeFile("./ddd.txt",content,{
    encoding:'utf-8',
    flag:'a+'
},(err) => { 
    if (err) {
        console.log("文件写入错误",err);
    }else {
        console.log("文件写入成功");
    }
})