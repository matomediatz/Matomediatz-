const nodemailer = require('nodemailer');
require('dotenv').config();

const sendTestMail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'wekaemailyako@gmail.com', // badilisha hii na email yako
      subject: 'Test Email from Matomediatz',
      text: 'Hello! This is a test email.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (err) {
    console.error('Error sending mail:', err);
  }
};

sendTestMail();
