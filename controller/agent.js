const Student = require("../models/student");
const Agent = require("../models/agent");
const Applcation = require("../models/applications");
const Documents = require("../models/documents");
const agent = require("../models/agent");

var create = async function (req, res) {
  try {
    let body = req.body;

    const { agentID, countryLookingFor, phone } = body;
    console.log(agentID);
    const studentFound = await Student.findOne({ studentID: agentID });
    if (studentFound) {
      return res
        .status(403)
        .send({ message: "You have an account already as a student" });
    } else {
      console.log("2");
      const agentFound = await Agent.findOne({ agentID })
        .populate("documents")
        .exec();
      if (agentFound) {
        if (countryLookingFor == "notSure") {
          const studentFound = await Student.find({ verified: true })
            .populate("documents")
            .exec();

          if (studentFound) {
            return res.status(200).send({
              message: "Successfully retrieved the data",
              agent: agentFound,
              students: studentFound,
            });
          }
        } else {
          const studentFound = await Student.find({
            countryLookingFor: countryLookingFor,
            verified: true,
          })
            .populate("documents")
            .exec();
          if (studentFound) {
            return res.status(200).send({
              message: "Successfully retrieved the data",
              agent: agentFound,
              students: studentFound,
            });
          }
        }
      } else {
        const newAgent = await Agent({
          agentID: agentID,
          phone: phone,
          ...body,
        });
        newAgent
          .save()
          .then((doc) => {
            return res.status(200).send({
              message: "Successfully created the data",
              agent: doc,
              students: studentFound,
            });
          })
          .catch((err) => {
            res.status(500).send({ error: err.message });
          });
      }
    }
  } catch {
    (error) => {
      return res.status(500).send({ message: error.message });
    };
  }
};
module.exports = { create };
