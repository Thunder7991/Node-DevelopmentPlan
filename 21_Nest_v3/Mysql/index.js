const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'thunderchen',
    database: 'practice',


})
connection.query(
    `SELECT * FROM customers`,
    function (err,results,fields) {
        console.log(results);
        console.log(fields.map(item => item.name)); 
    }
)

connection.query(
    `SELECT * FROM customers WHERE name LIKE ?`,
    ["李%"],
    function (err,results,fields) {
        console.log(results);
        console.log(fields.map(item => item.name)); 
    }

)

//插入一条数据
connection.execute('INSERT INTO customers (name) VALUES (?)',
    ['陈陈'], (err, results, fields) => {
    console.log(err);
});

//修改
connection.execute('UPDATE customers SET name="guang" where name="光"',
(err) => {
    console.log(err);
});

//删除
connection.execute(
    'DELETE  FROM customers where name=?',
    ['陈陈'],
    (err) =>{
        console.log(err);
    }
)