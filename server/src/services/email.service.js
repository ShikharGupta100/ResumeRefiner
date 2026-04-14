const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from:    "Resume Refiner <onboarding@resend.dev>",
            to,
            subject,
            html,
        });
        if (error) throw new Error(error.message);
        console.log("Email sent:", data.id);
        return data;
    } catch (err) {
        console.error("Email error:", err);
        throw err;
    }
};

// ✅ Sends a 6-digit OTP instead of a verification link
const sendVerificationEmail = async (email, name, otp) => {
    await sendEmail({
        to:      email,
        subject: "Your Verification Code – Resume Refiner",
        html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
                <h2>Hi ${name}! 👋</h2>
                <p>Use the code below to verify your email address.</p>
                <div style="font-size:36px;font-weight:bold;letter-spacing:8px;
                            background:#f4f4f4;padding:20px;border-radius:8px;
                            text-align:center;margin:24px 0;">
                    ${otp}
                </div>
                <p>This code expires in <strong>10 minutes</strong>.</p>
                <p>If you didn't create an account, ignore this email.</p>
            </div>
        `,
    });
};

const sendWelcomeEmail = async (to, name) => {
    await sendEmail({
        to,
        subject: "Welcome to Resume Refiner!",
        html: `
            <h2>Hi ${name}! 👋</h2>
            <p>Your email is verified. Start improving your resume today!</p>
            <a href="${process.env.FRONTEND_URL}">Get Started</a>
        `,
    });
};

const sendPasswordResetEmail = async (to, resetLink) => {
    await sendEmail({
        to,
        subject: "Reset Your Password",
        html: `
            <h2>Password Reset Request</h2>
            <p>Click below to reset your password. Expires in 1 hour.</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you didn't request this, ignore this email.</p>
        `,
    });
};

module.exports = { sendEmail, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail };