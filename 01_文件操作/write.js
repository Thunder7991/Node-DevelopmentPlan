let fs =require("fs")
fs.writeFile("./a.txt","thunderchen",(err) => {
    console.log(err);
})