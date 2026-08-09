import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export async function sendVerificationEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"QueryFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your QueryFlow account",
    text: `Your QueryFlow verification code is ${otp}. This code expires in 10 minutes.`,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
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
}
