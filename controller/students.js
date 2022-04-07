const Student = require("../models/student");
const Agent = require("../models/agent");
const Applcation = require("../models/applications");
const Documents = require("../models/documents");

var create = async function (req, res) {
  let body = req.body;

  const { studentID, phone, countryLookingFor } = req.body;
  if (!studentID || !phone || !countryLookingFor) {
    return res.status(400).send({
      message: `One of the imported fields is missing phone:${!phone} studnetID:${!studentID} countryLookingFor:${!countryLookingFor}`,
    });
  }

  //find student id already registered as agent
  Agent.findOne({ agentID: studentID }, (error, agentFound) => {
    if (error) {
      return res.status(500).send({ error1: error.message });
    } else if (agentFound) {
      return res
        .status(403)
        .send({ message: "You have an account already as an agent" });
    }
  });

  //find student exists
  Student.findOne({ studentID })
    .populate("documents") //find student in document collection
    .populate({
      //find student in application submitted
      path: "previousApplications",
      populate: {
        path: "agent",
      },
    })
    .exec((error, studentFound) => {
      if (error) {
        return res.status(500).send({ error2: error.message });
      } //retreive all the agent for the student
      else if (studentFound && countryLookingFor == "notSure") {
        Agent.find({ verified: true }, (error, agents) => {
          if (error) {
            return res.send(500).send({ error3: error.message });
          } else if (agents.length == 0) {
            return res.status(200).send({
              message: "Successfully retrieved the data",
              student: studentFound,
              agents: "NO verfied agent available",
            });
          } else {
            return res.status(200).send({
              message: "Successfully retrieved the data",
              student: studentFound,
              agents: agents,
            });
          }
        });
      } //retreive all the agent for specific country
      else if (studentFound) {
        Agent.find(
          { countryLookingFor: countryLookingFor, verified: true },
          (e, agents) => {
            if (e) {
              return res.send(500).send({ error4: e.message });
            } else if (agents.length == 0) {
              return res.status(200).send({
                message: "Successfully retrieved the data",
                student: studentFound,
                agents: "NO verfied agent available",
              });
            } else {
              return res.status(200).send({
                message: "Successfully retrieved the data",
                student: studentFound,
                agents: agents,
              });
            }
          }
        );
      } else {
        var newStudent = new Student({
          studentID: studentID,
          phone: phone,
          countryLookingFor: countryLookingFor,
          ...body,
        });

        newStudent
          .save()
          .then((doc) => {
            Agent.find(
              { countryLookingFor: countryLookingFor, verified: true },
              (e, agents) => {
                if (e) {
                  return res.send(500).send({ error5: e.message });
                } else {
                  return res.status(201).send({
                    message: "Successfully created the data",
                    student: doc,
                    agents: agents,
                  });
                }
              }
            );
          })

          .catch((error) => {
            return res.status(500).send({ error6: error.message });
          });
      }
    });
};

module.exports = { create };
