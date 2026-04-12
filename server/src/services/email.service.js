const nodemailer = require("nodemailer");

async function sendVerificationEmail(email, name, token) {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  await transporter.sendMail({
    from: `"ATS Resume Checker" <${process.env.BREVO_USER}>`,
    to: email,
    subject: "Verify your email — ATS Resume Checker",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Hi ${name} 👋</h2>
        <p>Thanks for signing up! Please verify your email.</p>
        <a href="${link}" style="
          display:inline-block;padding:12px 24px;
          background:#6366f1;color:#fff;border-radius:8px;
          text-decoration:none;font-weight:600;margin:16px 0
        ">Verify Email</a>
        <p style="color:#888;font-size:0.85rem">
          Link expires in 24 hours.
        </p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail };