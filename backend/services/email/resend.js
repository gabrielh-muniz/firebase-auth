import { config } from "dotenv";
import { Resend } from "resend";

config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function resendEmailVerification(
  email,
  password,
  verificationLink
) {
  const subject = "Welcome to Our Service - Email Verification";

  // Simple HTML email template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .header {
            background-color: #f5f5f5;
            padding: 10px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 0.8rem;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Our Service!</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Thank you for signing up! Please verify your email address to activate your account.</p>
            
            <p>Your account details:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationLink}" class="button">Verify Email</a>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${verificationLink}</p>
            
            <p>If you didn't create this account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: subject,
    html: htmlContent,
  });

  if (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }

  return data;
}
