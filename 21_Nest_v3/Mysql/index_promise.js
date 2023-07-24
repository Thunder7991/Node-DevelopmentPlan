const mysql = require('mysql2/promise');

(async function() {

    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'thunderchen',
        database: 'practice'
    });

    const [results, fields] = await connection.query('SELECT * FROM customers');

    console.log(results);
    console.log(fields.map(item => item.name)); 

})();