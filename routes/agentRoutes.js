var express = require("express");
var router = express.Router();
var agent = require("../controller/agent");
/* GET home page. */
router.post("/home", agent.create); //create agent profile
router.put("/update", agent.agentDataUpdate); //update agent profile
router.post("/getStudent/doc", agent.getStudentDoc); //get student documents
router.post("/createDoc", agent.agentDocCreate); //create document for agent
router.put("/updateDoc", agent.updateAgentDoc); //update document for agent
router.delete("/deleteDoc", agent.agentDeleteDoc); //delete document for agent

module.exports = router;
