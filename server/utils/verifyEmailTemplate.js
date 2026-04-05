// verifyEmailTemplate.js

function verifyEmailTemplate(username, otp) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification Code</title>
      <style>
          body {
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f6f8;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              background-color: #ffffff;
              margin: 40px auto;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
              padding: 40px 30px;
              text-align: center;
          }
          h2 {
              color: #333333;
              margin-bottom: 10px;
          }
          p {
              color: #555555;
              font-size: 15px;
              margin: 5px 0;
          }
          .otp-box {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              font-size: 26px;
              font-weight: bold;
              letter-spacing: 5px;
              padding: 12px 20px;
              border-radius: 8px;
              margin: 20px 0;
          }
          .footer {
              color: #999999;
              font-size: 12px;
              margin-top: 30px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Hello${username ? `, ${username}` : ""}!</h2>
          <p>Thank you for registering with <strong>Beautif Shop</strong>.</p>
          <p>Please use the following verification code to verify your email address:</p>
          <div class="otp-box">${otp}</div>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <div class="footer">
              <p>If you didn’t request this email, please ignore it.</p>
              <p>&copy; ${new Date().getFullYear()} Beautif Shop — All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
}

export default verifyEmailTemplate;