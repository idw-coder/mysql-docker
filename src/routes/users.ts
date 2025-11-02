import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
// const db = require('../db'); // データベース接続
import prisma from '../prisma-client';

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
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
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
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    /**
     * create()は新しいユーザーを作成
     */
    const user = await prisma.user.create({
      data: { name, email, password }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

export default router;