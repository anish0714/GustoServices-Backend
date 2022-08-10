const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, text) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: `<div>Hello,</div><br><div>There was a request to change your password!</div><br><div>If you did not make this request then please ignore this email.</div><br><div>Otherwise, please click this link to change your password: ${text}</div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    console.log("Email sent sucessfully");
  } catch (error) {
    console.log(error, "Error sending the mail");
  }
};

module.exports = sendEmail;
