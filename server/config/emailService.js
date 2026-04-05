import http from "http";
import nodemailer from "nodemailer";
import "dotenv/config"; // Load environment variables from .env

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // ✅ fixed typo
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
}

export default sendEmail;
