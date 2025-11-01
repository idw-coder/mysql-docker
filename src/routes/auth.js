var express = require('express');
var router = express.Router();
// const db = require('../db');
const { generateToken, verifyToken } = require('../utils/jwt');
const prisma = require('../prisma-client'); // Prisma クライアントをインポート

/* サインアップ */
router.post('/signup', async function(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // ユーザーを挿入（UUID を明示的に指定）
    // const [result] = await db.query(
    //   'INSERT INTO users (id, name, email, password) VALUES (UUID(), ?, ?, ?)',
    //   [name, email, password]
    // );


    // 挿入したユーザーのIDを取得
    // const [userRows] = await db.query(
    //   'SELECT id FROM users WHERE email = ? LIMIT 1',
    //   [email]
    // );
    // const userId = userRows[0].id;

    // プロフィールを挿入
    // await db.query(
    //   'INSERT INTO profiles (id) VALUES (?)',
    //   [userId]
    // );

    /**
     * create() で新しいレコードを作成
     */
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        profile: {
          create: {} //
        }
      }
    });

    // JWTトークンを生成
    const token = generateToken(user.id);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* サインイン */
router.post('/signin', async function(req, res, next) {
  try {
    const { email, password } = req.body;

    // const [rows] = await db.query(
    //   'SELECT * FROM users WHERE email = ? AND password = ?',
    //   [email, password]
    // );

    // const user = rows[0];

    /**
     * findFirst() で条件に合う最初の1件を取得（複数条件OK）
     */
    const user = await prisma.user.findFirst({
      where: {
        email,
        password,
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // JWTトークンを生成
    const token = generateToken(user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    });
    console.log('Signin successful for user ID:', user.id);
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* トークン検証 */
router.post('/verify', async function(req, res, next) {
  try {
    const { token } = req.body;

    // トークンが送信されていない場合
    if (!token) {
      return res.status(401).json({ error: 'トークンが提供されていません' });
    }

    /**
     * verifyToken() 関数を使用してトークンを検証
     * @param {string} token - JWTトークン
     * @returns {object|null} デコードされたペイロード、または null（無効な場合）
     */
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'トークンが無効です' });
    }

    // ユーザー情報を取得
    // const [rows] = await db.query(
    //   'SELECT id, name, email FROM users WHERE id = ?',
    //   [decoded.userId]
    // );

    // if (rows.length === 0) {
    //   return res.status(401).json({ error: 'ユーザーが見つかりません' });
    // }

    // const user = rows[0];

    /**
     * findUnique() ユニークな値で1件を取得
     */
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'ユーザーが見つかりません' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;