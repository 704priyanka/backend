var router = require("express").Router();
var studentdata = require("../controller/students");
/* GET home page. */
router.post("/home", studentdata.create);
router.put("/update", studentdata.studentDataUpdate);
router.post("/application/add", studentdata.addApplication);
router.post("/createDoc", studentdata.createDoc);
router.put("/updateDoc", studentdata.updateDoc);
router.delete("/deleteDoc", studentdata.deleteDoc);
// router.post("/addChatDoc", studentdata.addChatDoc);
// router.post("/getChatDoc", studentdata.getChatDoc);

module.exports = router;
