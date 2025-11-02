import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * JWTトークンを生成
 * @param {string} userId - ユーザーID
 * @returns {string} JWTトークン
 */
export function generateToken(userId: string): string {
  return jwt.sign(
    { userId }, // ペイロード（トークンに含めるデータ）
    JWT_SECRET, // 秘密鍵
    { expiresIn: JWT_EXPIRES_IN } as SignOptions // 有効期限
  );
}

/**
 * JWTトークンを検証
 * @param {string} token - JWTトークン
 * @returns {object|null} デコードされたペイロード、または null（無効な場合）
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null; // トークンが無効または期限切れ
  }
}