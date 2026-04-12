// server/src/services/email.service.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

async function sendVerificationEmail(email, name, token) {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from:    `"ATS Resume Checker" <${process.env.GMAIL_USER}>`,
    to:      email,
    subject: "Verify your email — ATS Resume Checker",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Hi ${name} 👋</h2>
        <p>Thanks for signing up! Please verify your email to get started.</p>
        <a href="${link}" style="
          display:inline-block;padding:12px 24px;
          background:#6366f1;color:#fff;border-radius:8px;
          text-decoration:none;font-weight:600;margin:16px 0
        ">Verify Email</a>
        <p style="color:#888;font-size:0.85rem">
          Link expires in 24 hours. If you didn't sign up, ignore this email.
        </p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail };