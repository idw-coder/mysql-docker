const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'], // 開発中はログを出力
});

module.exports = prisma;