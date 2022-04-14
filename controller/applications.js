const Student = require("../models/student");
const Application = require("../models/applications");
const Agent = require("../models/agent");
function randomColor() {
  const color = [
    "#0xff7D71C6",
    "#0xff59B298",
    "#0xffBC6262",
    "#0xff4AA1B4",
    "#0xffD88B60",
    "#0xffB25999",
  ];
  let index = Math.floor(Math.random() * color.length);

  return color[index];
}
//create application for student

const create = async function (req, res) {
  try {
    let color = randomColor();
    const body = req.body;
    const {
      student,
      agent,
      universityName,
      location,
      applicationFees,
      courseName,
    } = body;

    const applicationOffer = {
      color,
      ...body,
    };
    if (!student || !agent) {
      return res.status(400).send({
        message: "Important field missing",
        fieldName: "StudentID or AgentID",
      });
    }
    if (!universityName || !location || !location.city || !location.country) {
      return res.status(400).send({
        message: "University data missing",
        fieldName: "Some of university related data might be missing",
      });
    }
    if (!applicationFees || !courseName) {
      return res.status(400).send({
        message: "Application fee is missing or course Name",
        fieldName: "Please fill in some application fees amount or courseName",
      });
    }
    const studentFound = await Student.findOne({ studentID: studentID });
    if (!studentFound) {
      return res.status(500).send({
        message: "Student with given id doesn't exist",
      });
    }
    const agentFound = await Agent.findOne({ agentID: agentID });
    if (!agentFound) {
      return res.status(500).send({
        message: "Agent with given id doesn't exist",
      });
    } else if (agentFound.verified === true) {
      return res.status(500).send({
        message:
          "Agent with given id doesn't has verified and needs to add required documents",
        data: agentFound,
      });
    } else {
      applicationOffer.student = studentFound.id;
      applicationOffer.agent = agentFound.id;
      const applicationCreated = await Application.create(applicationOffer);

      studentFound.previousApplications.push(applicationCreated);

      studentFound.save((err, studentUpdated) => {
        console.log(studentUpdated);
        if (err || !studentUpdated) {
          throw Error(
            err.message
              ? err.message
              : "Student updation problem something went wrong"
          );
        } else {
          return res.status(201).send({
            message: "Successfully created a application Offer",
            data: applicationCreated,
          });
        }
      });
    }
  } catch {
    (error) => {
      return res.status(500).send({ message: error.message });
    };
  }
};
module.exports = {
  create,
};
