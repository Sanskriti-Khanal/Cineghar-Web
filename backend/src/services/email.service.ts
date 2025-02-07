import nodemailer from "nodemailer";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM,
  FRONTEND_URL,
} from "../configs";

function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth:
      SMTP_USER && SMTP_PASS
        ? { user: SMTP_USER, pass: SMTP_PASS }
        : undefined,
  });
}

export class EmailService {
  /**
   * Send reset password email with a link containing the token.
   * Link format: {FRONTEND_URL}/reset-password?token={token}
   */
  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

    const transporter = createTransporter();

    await transporter.sendMail({
      from: MAIL_FROM,
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
