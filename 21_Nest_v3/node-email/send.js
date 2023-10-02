const nodemailer = require("nodemailer");
const fs =require("fs");
const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false,
    auth: {
        user: 'xxx@qq.com',
        pass: 'SlL6kns5Qw7nN4/60N6jrG6wZaDzgARtINhiBXFKu4Y='
    },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"chen" <853524319@qq.com>',
    to: "853524319@qq.com",
    subject: "Hello 111", 
    text: "853524319",
    html:fs.readFileSync("./test.html","utf-8"),
  });

  console.log("邮件发送成功：", info.messageId);
}

main().catch(console.error);
