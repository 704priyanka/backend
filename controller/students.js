const Student = require("../models/student");
const Agent = require("../models/agent");
const Applcation = require("../models/applications");
const Documents = require("../models/documents");

var create = async function (req, res) {
  let body;
  console.log(req.body);
  const { studentID, phone } = req.body;
  const countryLookingFor = req.body.countryLookingFor;
  let student = {
    studentID: studentID,
    phone: phone,
    ...body,
  };
  console.log(student);
  var newUser = new Student({
    studentID: studentID,
    phone: phone,
    countryLookingFor: countryLookingFor,
  });

  newUser
    .save()
    .then((doc) => res.send("registrered"))
    .catch((err) => res.send(err.message));
};
module.exports = { create };
