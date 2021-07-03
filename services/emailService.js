const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("api key is ", process.env.SENDGRID_API_KEY);

const sendEmail = async ({ from, to, subject, text, html }) => {
  const msg = {
    to: to, // Change to your recipient
    from: {
      name: from,
      email: process.env.SENDGRID_EMAIL,
    }, // Change to your verified sender
    subject,
    text,
    html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;