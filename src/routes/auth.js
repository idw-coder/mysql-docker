var express = require('express');
var router = express.Router();
const db = require('../db');

/* サインアップ */
router.post('/signup', async function(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // ユーザーを挿入（UUID を明示的に指定）
    const [result] = await db.query(
      'INSERT INTO users (id, name, email, password) VALUES (UUID(), ?, ?, ?)',
      [name, email, password]
    );

    // 挿入したユーザーのIDを取得
    const [userRows] = await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const userId = userRows[0].id;

    // プロフィールを挿入
    await db.query(
      'INSERT INTO profiles (id) VALUES (?)',
      [userId]
    );

    res.status(201).json({
      id: userId,
      name,
      email
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'ユーザー登録に失敗しました' });
  }
});

/* サインイン */
router.post('/signin', async function(req, res, next) {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' });
    }

    const user = rows[0];

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'ログインに失敗しました' });
  }
});

module.exports = router;