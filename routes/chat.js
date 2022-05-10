const router = require("express").Router();

const chatDoc = require("../controller/chat");

router.post("/addChatDoc", chatDoc.addChatDoc);
router.post("/getChatDoc", chatDoc.getChatDoc);

module.exports = router;
