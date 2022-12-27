let inquirer = require('inquirer');
const config = require('../../config');
let downloadFn =require("./download")
// project
const myAction = async (project, args) => {
  //命令行的执行逻辑代码
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'thundechen',
      choices: config.framwork,
      message: '请选择你所使用的框架',
    },
  ]);
  //下载代码的功能
  downloadFn(config.framworkUrl[answer.framwork],project)

};

module.exports = myAction;
