var express = require("express");
var router = express.Router();
var studentdata = require("../controller/students");
/* GET home page. */
router.post("/home", studentdata.create);
router.put("/update/:studentID");
router.post("/application/add");
router.post("/createDoc");
router.put("/updateDoc");
router.delete("/deleteDoc");

module.exports = router;
