var express = require("express");
var router = express.Router();
const application = require("../controller/applications");
/* GET home page. */
router.post("/create", application.create);
router.post("/favourite", application.favourite);

module.exports = router;
5