var express = require("express");
var router = express.Router();
const application = require("../controller/applications");
/* GET home page. */
router.post("/create", application.create);
router.post("/favourite", application.favourite);
router.post("/progressUpdate", application.progress);

module.exports = router;
