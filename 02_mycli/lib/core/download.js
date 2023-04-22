const download = require('download-git-repo');
const ora = require("ora")
const chalk =require("chalk")
const config = require('../../config');
const downloadFn = function (url,project) {
    const spinner = ora().start()
    spinner.text = "代码正在下载......"
    download(
        `direct:${url}`,
        project, //放置的位置
        {
          clone: true,
        },
        (err) => {
        //   console.log(err);
        if (!err) {
            spinner.succeed("代码下载成功！")
            console.log(chalk.blue.bold("Done!"),"开始运行吧~");
            console.log('cd' + project);
            console.log("npm install");
            console.log("npm run dev");
        }else {
            spinner.fail("代码下载失败！")
        }
        },
      );
      
}

module.exports = downloadFn
