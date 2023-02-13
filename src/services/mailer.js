const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'americanacademyeg.com',
  port: 465,
  secure: true,
  auth: {
    user: 'payment@americanacademyeg.com',
    pass: 'Act@@ets@2022',
  },
});

async function sendNotification(email) {
  // Define the email options
  const mailOptions = {
    from: 'payment@americanacademyeg.com',
    to: [
      'customer2@americanacademyeg.com',
      'sales2@americanacademyeg.com',
      'accountant4@americanacademyeg.com',
    ],
    subject: 'Payment Request from' + email.name,
    text: `${email.name} has tried to make a payment request throw your payment page.
            Phone: ${email.phone}
            National ID: ${email.nationalId}
            Course: ${email.description}
            Amount: ${email.amount} ${email.currency}`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendNotification;
