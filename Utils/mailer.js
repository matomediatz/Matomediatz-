const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify your Email - Matomediatz',
    html: `<p>Click the link below to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
