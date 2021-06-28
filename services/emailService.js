const nodemailer = require('nodemailer');
module.exports = async function sendMail ({from , to , subject , text , html}){
   let transporter = nodemailer.createTransport({
       host   : process.env.SMTP_HOST,
       port   : process.env.SMTP_PORT,
       secure : false,
       auth   : {
           user : process.env.MAIL_USER,
           pass : process.env.MAIL_PASS
       }
   });
   // this sendMail is method of nodemailer
   let info = await transporter.sendMail({
       from    : `inShare <${from}>` ,
       to      : to,
       subject : subject, 
       text    : text, 
       html    : html

   })
}