const { TransactionalEmailsApi, SendSmtpEmail } = require("@getbrevo/brevo");

async function sendVerificationEmail(email, name, token) {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const apiInstance = new TransactionalEmailsApi();
  apiInstance.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

  const sendSmtpEmail = new SendSmtpEmail();
  sendSmtpEmail.sender = { name: "ATS Resume Checker", email: "laapta00@gmail.com" };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = "Verify your email — ATS Resume Checker";
  sendSmtpEmail.htmlContent = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Hi ${name} 👋</h2>
      <p>Thanks for signing up! Please verify your email.</p>
      <a href="${link}" style="
        display:inline-block;padding:12px 24px;
        background:#6366f1;color:#fff;border-radius:8px;
        text-decoration:none;font-weight:600;margin:16px 0
      ">Verify Email</a>
      <p style="color:#888;font-size:0.85rem">Link expires in 24 hours.</p>
    </div>
  `;

  await apiInstance.sendTransacEmail(sendSmtpEmail);
}

module.exports = { sendVerificationEmail };