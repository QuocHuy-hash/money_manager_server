const htmlEmailToken = (otp, to) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
    
    body {
      font-family: 'Open Sans', sans-serif;
      background-color: #fafafa;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    .email-container {
      max-width: 90%;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, .1);
    }
    
    .header {
      background-color: #0fd59f;
      color: white;
      text-align: center;
      padding: 10px;
    }
    
    .header-title {
      font-size: 18px;
      margin: 0;
    }
    
    .content {
      background-color: #fff;
      padding: 15px;
      text-align: center;
    }
    
    .content-text {
      font-size: 16px;
      color: #343434;
      margin: 10px 0;
    }
    
    .verification-code {
      background-color: #ddd;
      border-radius: 10px;
      padding: 10px;
      font-size: 24px;
      letter-spacing: 5px;
      margin: 20px auto;
      width: 80%;
    }
    
    .note {
      font-size: 14px;
      color: #343434;
      opacity: 0.3;
      font-style: italic;
    }
    
    .footer {
      background-color: #f0f0f0;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="header-title">Your Verification Code </h1>
    </div>
    <div class="content">
      <p class="content-text">Enter this verification code in the field:</p>
      <div class="verification-code">${otp}</div>
      <p class="content-text note">Verification code is valid only for 2 minutes</p>
    </div>
    <div class="footer">
      © 2024 huy343536@gmail.com. All rights reserved.
      <br>
      If you did not request this email, please ignore it.
    </div>
  </div>
</body>
</html>`;
}

module.exports = { htmlEmailToken };
