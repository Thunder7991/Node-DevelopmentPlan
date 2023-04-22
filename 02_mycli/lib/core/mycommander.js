const myaction = require('./action.js');

const mycommander = function (program) {
  program
    .command('create <project> [other...]')
    .alias('crt') //创建别名
    .description('创建项目')
    .action(myaction);
};

module.exports = mycommander;
