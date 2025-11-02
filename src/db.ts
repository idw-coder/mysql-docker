import mysql from 'mysql2/promise'; // ライブラリを使用してデータベース接続 → クエリ実行が可能に

// データベース接続プールの作成（接続プールとは、複数のクライアントからの接続を管理するための機能）
const pool = mysql.createPool({
  host: process.env.MYSQL_SERVER || 'mysql',
  user: process.env.MYSQL_USER || 'myapp_user',
  password: process.env.MYSQL_PASSWORD || 'myapp_password',
  database: process.env.MYSQL_DATABASE || 'myapp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;