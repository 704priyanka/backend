var express = require("express");
var router = express.Router();
var agent = require("../controller/agent");
/* GET home page. */
router.post("/home", agent.create); //create agent profile
router.post("/update/:agentID"); //update agent profile
router.post("/getStudent/doc"); //get student documents
router.post("/CreateDoc"); //create document for agent
router.put("/upadteDoc"); //upadte document for agent
router.delete("/deleteDoc"); //delete document for agent

module.exports = router;
