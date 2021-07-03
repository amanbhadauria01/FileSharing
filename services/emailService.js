// const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log("api key is ", process.env.SENDGRID_API_KEY);

const sendEmail = async ({ from, to, subject, text, html }) => {
  // let transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   secure: false,
  //   auth: {
  //     user: process.env.MAIL_USER,
  //     pass: process.env.MAIL_PASS,
  //   },
  // });
  // console.log("from is ", from);
  // console.log("to is ", to);
  //this send mail is a method of transporter object of nodemailer
  const msg = {
    to: to, // Change to your recipient
    from: {
      name: from,
      email: "aniket.nsit.2000@gmail.com",
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
  // let info = await transporter.sendMail({ from, to, subject, text, html });
  // console.log(info);
};

module.exports = sendEmail;
// xsmtpsib-14f1a27c70524e31c4bb43b894f5c373f6618074ed1a9cfe91b60a3eea7f05f1-7kxPQ1jWTYMyCGKb