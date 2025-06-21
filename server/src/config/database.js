// server/src/config/database.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Logs para debugging (remover em produção)
});
module.exports = prisma;
