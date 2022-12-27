let fs =require("fs")

fs.readFile("./a.txt","utf8",(err,data) => {
    console.log(err);
    console.log(data);
})