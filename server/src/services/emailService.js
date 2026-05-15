// NO PACKAGES NEEDED - Using native fetch() API

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Generate 6-digit verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, name, verificationCode) => {
  try {
    console.log(`📧 Attempting to send verification email to: ${email}`);

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "SkillSync AI",
        },
        to: [{ email, name: name || email.split("@")[0] }],
        subject: "Verify Your Email - SkillSync AI",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Verify Your Email - SkillSync AI</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
              .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
              .code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #6366f1; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>SkillSync AI</h1>
                <p>Your AI-Powered Career Partner</p>
              </div>
              <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Thank you for registering with SkillSync AI. Please verify your email address.</p>
                <div class="code">${verificationCode}</div>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <p>If you didn't create an account, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; 2026 SkillSync AI. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `Welcome to SkillSync AI!\n\nYour verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Verification email sent successfully:", data.messageId);
      return { success: true, messageId: data.messageId };
    } else {
      console.error("❌ Brevo API Error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }
  } catch (error) {
    console.error("❌ Send email error:", error.message);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log(`📧 Sending password reset email to: ${email}`);

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "SkillSync AI",
        },
        to: [{ email, name: name || email.split("@")[0] }],
        subject: "Reset Your Password - SkillSync AI",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Reset Your Password - SkillSync AI</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
              .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>SkillSync AI</h1>
              </div>
              <div class="content">
                <h2>Hello ${name}!</h2>
                <p>We received a request to reset your password. Click the button below:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p>This link expires in <strong>1 hour</strong>.</p>
                <p>If you didn't request this, please ignore this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `Reset Your Password for SkillSync AI\n\nClick this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Password reset email sent:", data.messageId);
      return { success: true };
    } else {
      console.error("❌ Reset email error:", data);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("❌ Reset email error:", error.message);
    return { success: false, error: error.message };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    console.log(`📧 Sending welcome email to: ${email}`);

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "SkillSync AI",
        },
        to: [{ email, name: name || email.split("@")[0] }],
        subject: "Welcome to SkillSync AI! 🚀",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Welcome to SkillSync AI!</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
              .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to SkillSync AI!</h1>
              </div>
              <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Your email has been verified successfully. Welcome to SkillSync AI!</p>
                <p>Here's what you can do next:</p>
                <ul>
                  <li>📄 Upload your resume for AI analysis</li>
                  <li>🎯 Get personalized job matches</li>
                  <li>📊 Analyze skill gaps</li>
                  <li>🗺️ Generate career roadmap</li>
                </ul>
                <p>Get started by logging into your account!</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `Welcome to SkillSync AI, ${name}!\n\nYour email has been verified successfully.\n\nGet started at: ${process.env.FRONTEND_URL}`,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Welcome email sent:", data.messageId);
      return { success: true };
    } else {
      console.error("❌ Welcome email error:", data);
      return { success: false };
    }
  } catch (error) {
    console.error("❌ Welcome email error:", error.message);
    return { success: false };
  }
};
