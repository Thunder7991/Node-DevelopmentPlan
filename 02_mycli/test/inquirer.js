import inquirer from 'inquirer';
inquirer
  .prompt([
    {
      type: 'input', //问题类型
      name: 'user',
      message: '你的名字是什么？',
    },
  ])
  .then((answer) => {
    console.log(answer);
  });
