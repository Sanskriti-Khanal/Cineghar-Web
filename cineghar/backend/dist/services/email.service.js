"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const configs_1 = require("../configs");
function createTransporter() {
    return nodemailer_1.default.createTransport({
        host: configs_1.SMTP_HOST,
        port: configs_1.SMTP_PORT,
        secure: configs_1.SMTP_SECURE,
        auth: configs_1.SMTP_USER && configs_1.SMTP_PASS
            ? { user: configs_1.SMTP_USER, pass: configs_1.SMTP_PASS }
            : undefined,
    });
}
class EmailService {
    /**
     * Send reset password email with a link containing the token.
     * Link format: {FRONTEND_URL}/reset-password?token={token}
     */
    async sendResetPasswordEmail(to, token) {
        const resetLink = `${configs_1.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;
        const transporter = createTransporter();
        await transporter.sendMail({
            from: configs_1.MAIL_FROM,
            to,
            subject: "Reset your password - CineGhar",
            text: `You requested a password reset. Click the link below to set a new password (valid for 1 hour):\n\n${resetLink}\n\nIf you did not request this, you can ignore this email.`,
            html: `
        <p>You requested a password reset for your CineGhar account.</p>
        <p>Click the link below to set a new password (valid for 1 hour):</p>
        <p><a href="${resetLink}" style="color: #8B0000;">Reset password</a></p>
        <p>If the link doesn't work, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all;">${resetLink}</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
        });
    }
}
exports.EmailService = EmailService;
