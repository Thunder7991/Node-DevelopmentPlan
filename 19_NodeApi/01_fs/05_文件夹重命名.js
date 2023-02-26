const fs = require("fs")

fs.rename("./thunder","./chen",(err) => {
    console.log("重命名结果:" , err);
})

//对文件进行重命名
fs.rename("./ccc/txt","./ddd.txt",(err) => {
    console.log("重命名结果:",err);
})