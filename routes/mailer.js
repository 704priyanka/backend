var express = require("express");
var router = express.Router();
var sendMail = require("../controller/mailer");
/* GET home page. */
router.get("/", sendMail.sendMail);

module.exports = router;
