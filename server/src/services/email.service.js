const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, name, token) {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Verify your email — ATS Resume Checker',
    html: `<h2>Hi ${name} 👋</h2>
           <p>Click below to verify your email:</p>
           <a href="${link}">Verify Email</a>`
  });
}

module.exports = { sendVerificationEmail };

