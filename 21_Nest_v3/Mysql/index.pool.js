const mysql = require('mysql2/promise');

(async function() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'thunderchen',
        database: 'practice',
        waitForConnections: true,//没有可用连接了，那就等待，设置为 false 就是直接返回报错。
        connectionLimit: 10, //最多有多少个连接
        maxIdle: 10, //最多有多少个空闲的，超过这个数量的空闲连接会被释放。
        idleTimeout: 60000, //空闲的连接多久会断开。
        queueLimit: 0, //排队的请求数量，超过这个数量就直接返回报错说没有连接了。设置为 0 就是排队没有上限。
        enableKeepAlive: true, //保持心跳用的，用默认的就好
        keepAliveInitialDelay: 0 //保持心跳用的，用默认的就好
      });

    // const [results] = await pool.query('select * from customers');
    // console.log(results);
    //或者可以手动取
    const connection = await pool.getConnection();
    const [results] = await connection.query('select * from orders');
    console.log(results);
})();