const ora =require("ora")
const spinner = ora().start()
spinner.text = 'loading......'
setTimeout(() => {
    console.log("thunderchen");
    spinner.succeed("已经成功了~")

    spinner.fail("结束")

    spinner.info("结束")
},3000)