## Stream

Node.js 中有四种基本流类型: 

-  **Writable:** 可以向其写入数据的流 (例如: fs.createWriteStream())
- **Readable:**可以从中读取数据的流 (例如: fs.createReadStream())
- **Duplex:** 同时为Readable和Writable (例如: net.Socket)
- **Transform:** Duplex写入和读取数据时修改或转换数据的流 (例如 zlib.createDeflate())



> 例如: Writable: Request 
>
> ​		Response: Response