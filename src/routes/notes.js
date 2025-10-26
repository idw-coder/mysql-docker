var express = require('express');
var router = express.Router();
const db = require('../db');

/* ノート一覧取得 */
router.get('/', async function(req, res, next) {
  try {
    const { userId, parentDocumentId, keyword } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userIdが必要です' });
    }

    let query = 'SELECT * FROM notes WHERE user_id = ?';
    let params = [userId];

    // 親ドキュメントIDでフィルタ
    if (parentDocumentId !== undefined) {
      query += ' AND parent_document = ?';
      params.push(parentDocumentId);
    }

    // キーワード検索
    if (keyword) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Notes fetch error:', error);
    res.status(500).json({ error: 'ノート取得に失敗しました' });
  }
});

/* 単一ノート取得 */
router.get('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userIdが必要です' });
    }

    const [rows] = await db.query(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'ノートが見つかりません' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Note fetch error:', error);
    res.status(500).json({ error: 'ノート取得に失敗しました' });
  }
});

/* ノート作成 */
router.post('/', async function(req, res, next) {
  try {
    const { userId, params } = req.body;
    const { title, parentId } = params || {};

    if (!userId) {
      return res.status(400).json({ error: 'userIdが必要です' });
    }

    const [result] = await db.query(
      'INSERT INTO notes (user_id, title, content, parent_document) VALUES (?, ?, ?, ?)',
      [userId, title || 'Untitled', '', parentId || null]
    );

    // 作成したノートを取得
    const [rows] = await db.query(
      'SELECT * FROM notes WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Note create error:', error);
    res.status(500).json({ error: 'ノート作成に失敗しました' });
  }
});

/* ノート更新 */
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const { title, content } = note || {};

    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }

    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: '更新内容が指定されていません' });
    }

    updateValues.push(id);

    await db.query(
      `UPDATE notes SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // 更新後のノートを取得
    const [rows] = await db.query('SELECT * FROM notes WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Note update error:', error);
    res.status(500).json({ error: 'ノート更新に失敗しました' });
  }
});

/* ノート削除 */
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM notes WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Note delete error:', error);
    res.status(500).json({ error: 'ノート削除に失敗しました' });
  }
});

module.exports = router;