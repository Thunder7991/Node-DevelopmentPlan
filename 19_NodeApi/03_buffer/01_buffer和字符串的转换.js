/*
 * @Author: thunderchen
 * @Date: 2023-02-27 22:25:05
 * @LastEditTime: 2023-02-27 22:26:36
 * @email: 853524319@qq.com
 * @Description: buffer 和 字符串的转换
 */

const buf = new Buffer.from('hello');
console.log(buf);

//创建buffer
const buf2 = Buffer.from('world');
console.log(buf2);

// 中文占3个字节
const buf3 = Buffer.from('陈dffd');
const buf4 = Buffer.from('dffd');

console.log(buf3);
console.log(buf4);

//创建buffer 设置编码
//编码
const buf5 = Buffer.from("哈哈","utf16le")
//解码
console.log(buf5.toString("utf16le")); 
