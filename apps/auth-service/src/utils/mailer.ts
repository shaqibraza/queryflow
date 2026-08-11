import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export async function sendVerificationEmail(email: string, otp: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"QueryFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your QueryFlow account",

      text: `Your QueryFlow verification code is ${otp}. This code expires in 10 minutes.`,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2>Verify your QueryFlow account</h2>

          <p>
            Thanks for creating a QueryFlow account.
            Use the verification code below:
          </p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 24px 0;
            "
          >
            ${otp}
          </div>

          <p>
            This code will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
      `
    });
  } catch (error) {
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  try {
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

    const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await transporter.sendMail({
      from: `"QueryFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your QueryFlow password",

      text: `
You requested to reset your QueryFlow password.

Reset your password using this link:

${resetUrl}

This link will expire in 15 minutes.

If you didn't request a password reset, you can safely ignore this email.
      `.trim(),

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 0 auto;
          "
        >
          <h2>Reset your QueryFlow password</h2>

          <p>
            We received a request to reset your QueryFlow password.
          </p>

          <p>
            Click the button below to choose a new password:
          </p>

          <div style="margin: 28px 0;">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 12px 22px;
                background: #6366f1;
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
              "
            >
              Reset Password
            </a>
          </div>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p style="color: #666;">
            If you didn't request a password reset,
            you can safely ignore this email.
          </p>
        </div>
      `
    });
  } catch (error) {
    throw error;
  }
}
