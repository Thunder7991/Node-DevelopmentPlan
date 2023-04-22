const fs = require("fs")

//创建一个buffer
// 8个字节大小的buffer内存空间
 const buf =  Buffer.alloc(8)
 //<Buffer 00 00 00 00 00 00 00 00>
//  console.log(buf);

 buf[0] = 100
 buf[1] = 0x66
 console.log(buf);
 console.log(buf.toString());

 

