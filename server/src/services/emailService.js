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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - SkillSync AI</title>
            <style>
              body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #1f2937; -webkit-font-smoothing: antialiased; }
              .wrapper { padding: 40px 20px; background-color: #f4f4f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
              .header-bar { height: 6px; background: linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef); width: 100%; }
              .header { padding: 40px 40px 20px; text-align: center; }
              .logo-text { font-size: 24px; font-weight: 800; background: -webkit-linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; margin: 0; }
              .content { padding: 0 40px 40px; text-align: center; }
              .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px; }
              .message { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 30px; }
              .code-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; margin: 30px 0; }
              .code { font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; margin: 0; }
              .footer { background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
              .footer-text { font-size: 13px; color: #64748b; margin: 0; }
              .disclaimer { font-size: 12px; color: #94a3b8; margin-top: 12px; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="header-bar"></div>
                <div class="header">
                  <h1 class="logo-text">SkillSync AI</h1>
                </div>
                <div class="content">
                  <h2 class="greeting">Hello \${name},</h2>
                  <p class="message">Welcome to SkillSync AI! To complete your registration and secure your account, please verify your email address using the code below.</p>
                  <div class="code-box">
                    <p class="code">\${verificationCode}</p>
                  </div>
                  <p class="message" style="font-size: 14px; margin-bottom: 0;">This verification code will expire in <strong>10 minutes</strong>.</p>
                </div>
                <div class="footer">
                  <p class="footer-text">© 2026 SkillSync AI. All rights reserved.</p>
                  <p class="disclaimer">If you did not request this email, please safely ignore it.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `Welcome to SkillSync AI!\n\nYour verification code is: \${verificationCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`,
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password - SkillSync AI</title>
            <style>
              body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #1f2937; -webkit-font-smoothing: antialiased; }
              .wrapper { padding: 40px 20px; background-color: #f4f4f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
              .header-bar { height: 6px; background: linear-gradient(135deg, #f43f5e, #db2777, #9333ea); width: 100%; }
              .header { padding: 40px 40px 20px; text-align: center; }
              .logo-text { font-size: 24px; font-weight: 800; background: -webkit-linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; margin: 0; }
              .content { padding: 0 40px 40px; text-align: center; }
              .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px; }
              .message { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 30px; }
              .btn-container { margin: 30px 0; }
              .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; font-weight: 600; font-size: 16px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25); transition: all 0.2s ease; }
              .footer { background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
              .footer-text { font-size: 13px; color: #64748b; margin: 0; }
              .disclaimer { font-size: 12px; color: #94a3b8; margin-top: 12px; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="header-bar"></div>
                <div class="header">
                  <h1 class="logo-text">SkillSync AI</h1>
                </div>
                <div class="content">
                  <h2 class="greeting">Password Reset Request</h2>
                  <p class="message">Hello \${name},<br>We received a request to reset the password associated with your SkillSync AI account. You can securely reset it by clicking the button below.</p>
                  <div class="btn-container">
                    <a href="\${resetUrl}" class="button">Reset My Password</a>
                  </div>
                  <p class="message" style="font-size: 14px; margin-bottom: 0;">This secure link will expire in <strong>1 hour</strong>.</p>
                </div>
                <div class="footer">
                  <p class="footer-text">© 2026 SkillSync AI. All rights reserved.</p>
                  <p class="disclaimer">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `Reset Your Password for SkillSync AI\n\nClick this link to reset your password: \${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to SkillSync AI!</title>
            <style>
              body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #1f2937; -webkit-font-smoothing: antialiased; }
              .wrapper { padding: 40px 20px; background-color: #f4f4f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
              .header-bar { height: 6px; background: linear-gradient(135deg, #10b981, #059669, #047857); width: 100%; }
              .header { padding: 40px 40px 20px; text-align: center; }
              .logo-text { font-size: 24px; font-weight: 800; background: -webkit-linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; margin: 0; }
              .content { padding: 0 40px 40px; }
              .greeting { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; text-align: center; }
              .message { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 24px; text-align: center; }
              .feature-list { background: #f8fafc; border-radius: 12px; padding: 24px; margin: 30px 0; border: 1px solid #e2e8f0; }
              .feature-item { display: table; width: 100%; margin-bottom: 16px; }
              .feature-item:last-child { margin-bottom: 0; }
              .feature-icon { display: table-cell; vertical-align: top; width: 32px; font-size: 20px; }
              .feature-text { display: table-cell; vertical-align: middle; font-size: 15px; color: #334155; font-weight: 500; }
              .btn-container { margin: 30px 0; text-align: center; }
              .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; font-weight: 600; font-size: 16px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.25); transition: all 0.2s ease; }
              .footer { background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
              .footer-text { font-size: 13px; color: #64748b; margin: 0; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="header-bar"></div>
                <div class="header">
                  <h1 class="logo-text">SkillSync AI</h1>
                </div>
                <div class="content">
                  <h2 class="greeting">Welcome aboard, \${name}! 🚀</h2>
                  <p class="message">Your email has been successfully verified. We are thrilled to have you join the future of AI-powered career growth.</p>
                  
                  <div class="feature-list">
                    <p style="margin-top: 0; margin-bottom: 16px; font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Here's what you can do next:</p>
                    <div class="feature-item">
                      <div class="feature-icon">📄</div>
                      <div class="feature-text">Upload your resume for deep AI analysis</div>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">🎯</div>
                      <div class="feature-text">Discover personalized job matches tailored to you</div>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">📊</div>
                      <div class="feature-text">Uncover hidden skill gaps to stay competitive</div>
                    </div>
                    <div class="feature-item">
                      <div class="feature-icon">🗺️</div>
                      <div class="feature-text">Generate a custom learning roadmap to level up</div>
                    </div>
                  </div>

                  <div class="btn-container">
                    <a href="\${process.env.FRONTEND_URL}/login" class="button">Access Your Dashboard</a>
                  </div>
                </div>
                <div class="footer">
                  <p class="footer-text">© 2026 SkillSync AI. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `Welcome to SkillSync AI, \${name}!\n\nYour email has been verified successfully.\n\nGet started at: \${process.env.FRONTEND_URL}`,
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
