const nodemailer = require('nodemailer');

const config = {
  HOST: process.env.EM_HOST,
  PORT: process.env.EM_PORT,
  USER: process.env.EM_USER,
  PASS: process.env.EM_PASS,
  FROM: process.env.EM_FROM,
  TO: process.env.EM_TO,
};

const transporter = nodemailer.createTransport({
  host: config.HOST,
  port: config.PORT,
  secure: true,
  auth: {
    user: config.USER,
    pass: config.PASS,
  },
});

async function sendNotification(email) {
  // Define the email options
  const mailOptions = {
    from: config.FROM,
    to: config.TO,
    subject: 'Payment Request from' + email.name,
    text: `
    ${email.name} has tried to make a payment request throw your payment page.
    Order Id: ${email.id}
    Phone: ${email.phone}
    National ID: ${email.nationalId}
    Course: ${email.description}
    Amount: ${email.amount} ${email.currency}`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendNotification;
