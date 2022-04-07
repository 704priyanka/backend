const Student = require("../models/student");
const Agent = require("../models/agent");
const Applcation = require("../models/applications");
const Documents = require("../models/documents");

var create = async function (req, res) {
  let body;
  console.log(req.body);
  const { agentID, phone } = req.body;
  const countryLookingFor = req.body.countryLookingFor;

  var newUser = new Agent({
    agentID: agentID,
    phone: phone,
    countryLookingFor: countryLookingFor,
  });

  newUser
    .save()
    .then((doc) => res.send("registrered"))
    .catch((err) => res.send(err.message));
};
module.exports = { create };
