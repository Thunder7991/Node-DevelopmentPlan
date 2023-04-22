const fs = require("fs")

// fs.writeFile("./test.txt"," hello world ",{
//     encoding:'utf-8',
//     flag:'a+'
// },(err) => {
//     console.log("写入文件结果:", err);
// })

//创建一个 写入流

const writeStream = fs.createWriteStream("./test.txt",{
    flags:'a+',
    start:5
})

writeStream.write(" thunderchen ")
writeStream.write(" thunderchen ",(err) =>{
    console.log("写入完成",err);
})

writeStream.on("close",() =>{
    console.log("文件被关闭!");
})

writeStream.end("哈哈哈")

writeStream.on("finish",() =>{
    console.log("写入完成!");
})