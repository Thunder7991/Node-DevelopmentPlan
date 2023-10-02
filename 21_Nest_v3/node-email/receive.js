const Imap = require('imap');
const fs = require('fs');
const path = require('path');
const { MailParser } =require('mailparser');
const imap = new Imap({
    user: 'xxx@qq.com',
    password: 'SlL6kns5Qw7nN4/60N6jrG6wZaDzgARtINhiBXFKu4Y=',
    host: 'imap.qq.com',
    port: 993,
    tls: true
});

imap.once('ready', () => {
    imap.openBox('INBOX', true, (err) => {
        imap.search([['SEEN'], ['SINCE', new Date('2023-07-10 19:00:00').toLocaleString()]], (err, results) => {
            if (!err) {
                handleResults(results)
            } else {
                throw err;
            }
        });
    });
});

imap.connect();


function handleResults(results) {
    imap.fetch(results, { 
        bodies: '',
    }).on('message', (msg) => {
        const mailparser = new MailParser();

        msg.on('body', (stream) => {

            const info = {};
            stream.pipe(mailparser);

            mailparser.on("headers", (headers) => {
                info.theme = headers.get('subject');
                info.form = headers.get('from').value[0].address;
                info.mailName = headers.get('from').value[0].name;
                info.to = headers.get('to').value[0].address;
                info.datatime = headers.get('date').toLocaleString();
            });

            mailparser.on("data", (data) => {
                if (data.type === 'text') {
                    info.html = data.html;
                    info.text = data.text;
                    const filePath = path.join(__dirname,'mails',info.theme + '.html')
                    fs.writeFileSync(filePath,info.html || info.text);
                    console.log(info);

                }
                if (data.type === 'attachment') {
                    const filePath = path.join(__dirname, 'files', data.filename);
                    const ws = fs.createWriteStream(filePath);
                    data.content.pipe(ws);
                }
            });
        });
    });
}