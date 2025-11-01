var express = require('express');
var router = express.Router();
// const db = require('../db'); // データベース接続
const prisma = require('../prisma-client');

/**
 * ユーザー一覧取得
 */
// router.get('/', async function(req, res, next) {
//   try {
//     const [rows] = await db.query('SELECT * FROM users');
//     res.json(rows);
//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({ error: 'データベースエラーが発生しました' });
//   }
// });
router.get('/', async function(req, res, next) {
  try {
    /**
     * findMany()はすべてのユーザーを取得
     */
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

/**
 * ユーザー作成
 */
// router.post('/', async function(req, res, next) {
//   try {
//     const { name, email } = req.body;
//     const [result] = await db.query(
//       'INSERT INTO users (name, email) VALUES (?, ?)',
//       [name, email]
//     );
//     res.status(201).json({ 
//       id: result.insertId, 
//       name, 
//       email 
//     });
//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({ error: 'データベースエラーが発生しました' });
//   }
// });
router.post('/', async function(req, res, next) {
  try {
    const { name, email } = req.body;
    /**
     * create()は新しいユーザーを作成
     */
    const user = await prisma.user.create({
      data: { name, email }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

module.exports = router;