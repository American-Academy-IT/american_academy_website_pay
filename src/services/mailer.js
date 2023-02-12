const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "americanacademyeg.com",
  port: 465,
  secure: true,
  auth: {
    user: "backend@americanacademyeg.com",
    pass: "Act@@etS@2026",
  },
});

async function sendNotification(email) {
  // Define the email options
  const mailOptions = {
    from: "backend@americanacademyeg.com",
    to: ["customer2@americanacademyeg.com", "sales2@americanacademyeg.com"],
    subject: "Payment Request from" + email.name,
    text: `${email.name} has tried to make a payment request throw your payment page.
            Phone: ${email.phone}
            National ID: ${email.nationalId}
            Course: ${email.description}
            Amount: ${email.amount} EGP`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendNotification;
