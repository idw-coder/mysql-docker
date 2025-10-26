const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * JWTトークンを生成
 * @param {string} userId - ユーザーID
 * @returns {string} JWTトークン
 */
function generateToken(userId) {
  return jwt.sign(
    { userId }, // ペイロード（トークンに含めるデータ）
    JWT_SECRET, // 秘密鍵
    { expiresIn: JWT_EXPIRES_IN } // 有効期限
  );
}

/**
 * JWTトークンを検証
 * @param {string} token - JWTトークン
 * @returns {object|null} デコードされたペイロード、または null（無効な場合）
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null; // トークンが無効または期限切れ
  }
}

module.exports = {
  generateToken,
  verifyToken
};