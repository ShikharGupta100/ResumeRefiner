const nodemailer = require("nodemailer");

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = await createTransporter();
    const result = await transporter.sendMail({
      from: `"Resume Refiner" <${process.env.GOOGLE_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

// ── Verification Email (required by auth.controller.js) ───────────────────────
const sendVerificationEmail = async (email, name, token) => {
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Verify Your Email – Resume Refiner",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Hi ${name}! 👋</h2>
        <p>Thanks for signing up. Please verify your email by clicking below.</p>
        <a href="${verifyLink}" 
           style="display:inline-block; padding:12px 24px; background:#4F46E5; 
                  color:white; border-radius:6px; text-decoration:none; margin:16px 0;">
          Verify Email
        </a>
        <p>This link expires in <strong>24 hours</strong>.</p>
        <p>If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
};

// Welcome email
const sendWelcomeEmail = async (to, name) => {
  await sendEmail({
    to,
    subject: "Welcome to Resume Refiner!",
    html: `
      <h2>Hi ${name}! 👋</h2>
      <p>Welcome to Resume Refiner. Start improving your resume today!</p>
      <a href="${process.env.FRONTEND_URL}">Get Started</a>
    `,
  });
};

// Password reset email
const sendPasswordResetEmail = async (to, resetLink) => {
  await sendEmail({
    to,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. It expires in 1 hour.</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail };