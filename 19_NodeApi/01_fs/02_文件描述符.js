/*
 * @Author: thunderchen
 * @Date: 2023-02-26 18:35:06
 * @LastEditTime: 2023-02-26 19:07:37
 * @email: 853524319@qq.com
 * @Description: 文件描述符
 */
// 每个进程.内核都维护着一张当前打开着的文件和资源的表格
// 每个打开的文件都会分配一个称之为文件描述符的简单的数字标识符
// 所有文件系统操作都使用这些文件描述符来标识和跟踪每个特定的文件
// windows 系统使用了一个虽然不同但概念上类似的机制来跟踪资源

const fs = require('fs');
// 文件描述符可以用于从文件读取数据 , 向文件写入数据,或者请求关于文件的信息
fs.open("./abc.txt",(err,fd) =>{
    if (err) {
        console.log("打开文件错误",err);
        return
    }
    console.log(fd); //3
    //读取文件的信息
    fs.fstat(fd,(err,stats) => {
        if (err) {
            return
        }
        console.log(stats);
        //关闭文件进程
        //node进行开启之后是不会关闭的
        fs.close(fd)
    })

})