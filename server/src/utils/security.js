// server/src/utils/security.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
/**
 * Gera hash da senha usando bcrypt com salt
 * @param {string} password - Senha em texto claro
 * @returns {Promise<string>} - Hash da senha
 */
async function hashPassword(password) {
    const saltRounds = 12; // Número de rounds para o salt (12 é considerado seguro)
    return await bcrypt.hash(password, saltRounds);
}
/**
 * Verifica se a senha corresponde ao hash
 * @param {string} password - Senha em texto claro
 * @param {string} hash - Hash armazenado
 * @returns {Promise<boolean>} - True se a senha estiver correta
 */
async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
/**
 * Gera um token JWT
 * @param {object} payload - Dados a serem incluídos no token
 * @returns {string} - Token JWT
 */
function generateJWT(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        issuer: 'auth-app',
        audience: 'auth-app-users'
});
}
/**
 * Verifica e decodifica um token JWT
 * @param {string} token - Token JWT
 * @returns {object} - Payload decodificado
 */
function verifyJWT(token) {
return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'auth-app',
    audience: 'auth-app-users'
});
}
/**
 * Gera um código de 6 dígitos para 2FA
 * @returns {string} - Código de 6 dígitos
 */
function generateTwoFactorCode() {
    return crypto.randomInt(100000, 999999).toString();
}
/**
 * Calcula a data de expiração para códigos 2FA
 * @returns {Date} - Data de expiração
 */
function getTwoFactorCodeExpiration() {
    const expirationMinutes = parseInt(process.env.TWO_FACTOR_CODE_EXPIRES_IN) || 10;
    return new Date(Date.now() + expirationMinutes * 60 * 1000);
}
module.exports = {
    hashPassword,
    verifyPassword,
    generateJWT,
    verifyJWT,
    generateTwoFactorCode,
    getTwoFactorCodeExpiration
};