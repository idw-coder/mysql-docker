var express = require('express');
var router = express.Router();
const db = require('../db'); // データベース接続

/* ユーザー一覧取得 */
router.get('/', async function(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

/* ユーザー作成 */
router.post('/', async function(req, res, next) {
  try {
    const { name, email } = req.body;
    const [result] = await db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      email 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

module.exports = router;