#! /usr/bin/env node

const { program } = require('commander');
const myhelp = require("../lib/core/help")
// if (process.argv[2]==='--help') {
//     console.log("获取到了命令参数~");
// }
myhelp(program)

const mycommander = require("../lib/core/mycommander")
mycommander(program)


program.parse(process.argv);
