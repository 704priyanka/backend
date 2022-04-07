const nodemailer = require("nodemailer");
require("dotenv").config();

var sendMail = function (req, res) {
  var body = req.body;
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const currentTime = new Date();
  var mailOptions = {
    to: body.email, // receiver email,
    subject: `Request for mail Time : ${currentTime}`,
    text: `Phone : ${body.phone}   \nComment : ${body.message}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.send("mail send sucessfully");
      console.log("information: " + info.response);
    }
  });
};

module.exports = {
  sendMail,
};
