const mysql = require('mysql2/promise');

// データベース接続プールの作成
const pool = mysql.createPool({
  host: process.env.MYSQL_SERVER || 'mysql',
  user: process.env.MYSQL_USER || 'myapp_user',
  password: process.env.MYSQL_PASSWORD || 'myapp_password',
  database: process.env.MYSQL_DATABASE || 'myapp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;