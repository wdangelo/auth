// server/src/config/email.js
const nodemailer = require('nodemailer');
// Configuração do transporter
const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true para 465, false para outras portas
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Para desenvolvimento local
}
});
/**
 * Envia e-mail de verificação com código 2FA
 * @param {string} email - E-mail do destinatário
 * @param {string} code - Código de verificação
 * @param {string} userName - Nome do usuário
 */
async function sendTwoFactorCode(email, code, userName) {
const mailOptions = {
    from: `"Auth App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Código de Verificação - Auth App',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 
    600px; margin: 0 auto;">
    <h2 style="color: #333;">Código de Verificação</h2>
    <p>Olá, ${userName}!</p>
    <p>Seu código de verificação é:</p>
    <div style="background-color: #f4f4f4; padding: 20px; 
    text-align: center; margin: 20px 0;">
    <h1 style="color: #007bff; font-size: 32px; margin: 
    0; letter-spacing: 5px;">${code}</h1>
    </div>
    <p><strong>Este código expira em $
    {process.env.TWO_FACTOR_CODE_EXPIRES_IN || 10} minutos.</
    strong></p>
    <p>Se você não solicitou este código, ignore este email.</p>
    <hr style="margin: 30px 0;">
    <p style="color: #666; font-size: 12px;">
    Este é um e-mail automático. Não responda a esta 
    mensagem.
    </p>
    </div>
    `
};
try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
} catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error: error.message };
}
}
/**
 * Envia e-mail de boas-vindas após verificação
 * @param {string} email - E-mail do destinatário
 * @param {string} userName - Nome do usuário
 */
async function sendWelcomeEmail(email, userName) {
    const mailOptions = {
    from: `"Auth App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Bem-vindo ao Auth App!',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 
    600px; margin: 0 auto;">
    <h2 style="color: #28a745;">Bem-vindo ao Auth App!</
    h2>
    <p>Olá, ${userName}!</p>
    <p>Sua conta foi criada e verificada com sucesso. Agora 
    você pode acessar todos os recursos da nossa aplicação.</p>
    <p>Obrigado por se juntar a nós!</p>
    <hr style="margin: 30px 0;">
    <p style="color: #666; font-size: 12px;">
    Este é um e-mail automático. Não responda a esta 
    mensagem.
    </p>
    </div>
    `
    };
    try {
    const info = await transporter.sendMail(mailOptions);
        console.log('E-mail de boas-vindas enviado:',
        info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Erro ao enviar e-mail de boas-vindas:', error);
        return { success: false, error: error.message };
    }
}
module.exports = {
sendTwoFactorCode,
sendWelcomeEmail
};