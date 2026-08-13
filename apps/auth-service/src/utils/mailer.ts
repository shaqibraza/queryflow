const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const getBrevoConfig = () => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Queryflow";

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  if (!senderEmail) {
    throw new Error("BREVO_SENDER_EMAIL is not configured");
  }

  return {
    apiKey,
    senderEmail,
    senderName
  };
};

const sendEmail = async ({
  to,
  subject,
  textContent,
  htmlContent
}: {
  to: string;
  subject: string;
  textContent: string;
  htmlContent: string;
}): Promise<void> => {
  const { apiKey, senderEmail, senderName } = getBrevoConfig();

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail
      },
      to: [
        {
          email: to
        }
      ],
      subject,
      textContent,
      htmlContent
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(`Brevo email API failed with status ${response.status}`);
  }
};

export async function sendVerificationEmail(email: string, otp: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Verify your QueryFlow account",

    textContent: `Your QueryFlow verification code is ${otp}. This code expires in 10 minutes.`,

    htmlContent: `
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
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: email,
    subject: "Reset your QueryFlow password",

    textContent: `
You requested to reset your QueryFlow password.

Reset your password using this link:

${resetUrl}

This link will expire in 15 minutes.

If you didn't request a password reset, you can safely ignore this email.
    `.trim(),

    htmlContent: `
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
}
