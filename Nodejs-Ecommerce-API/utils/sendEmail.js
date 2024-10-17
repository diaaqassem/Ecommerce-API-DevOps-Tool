/* eslint-disable import/no-extraneous-dependencies */
const nodemailer = require("nodemailer");
// eslint-disable-next-line import/newline-after-import
const dotenv = require("dotenv");
dotenv.config();
//  service that send emails, such as Gmail , SendGrid , mailgun , mailtrap
//  create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "outlook",
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_HOST, // generated ethereal email
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

module.exports = {
  sendEmail: async (to, resetCode) => {
    const mailOptions = {
      from: `E-commerce App  ${process.env.EMAIL_HOST}`, // sender address
      to: to.email, // list of receivers
      subject: `Reset Your Password!`, // Subject line
      text: `
      Dear ${to.name},

      You recently requested to reset your password. To complete the process, please use the following reset code:
      
      Reset Code: ${resetCode}
      
      If you did not request this change, you can safely ignore this email. Your account security is important to us, so please do not share this code with anyone.
      
      Best regards,
      ${to.name}`, // plain text body
    };
    try {
      await transporter.sendMail(mailOptions);
      // console.log("Message sent: successfully");
      return true;
    } catch (err) {
      // console.error(`Error sending Email : ${err.message}`);
      return false;
    }
  },
};
