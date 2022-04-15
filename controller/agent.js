const Student = require("../models/student");
const Agent = require("../models/agent");
const AgentDoc = require("../models/agentDoc");
var create = async function (req, res) {
  try {
    let body = req.body;
    const date = new Date().getFullYear();
    const { agentID, countryLookingFor, phone } = body;

    const studentFound = await Student.findOne({ studentID: agentID });
    if (studentFound) {
      return res
        .status(403)
        .send({ message: "You have an account already as a student" });
    } else {
      const agentFound = await Agent.findOne({ agentID }).populate("documents");

      if (agentFound) {
        const studentFound = await Student.find({
          countryLookingFor: countryLookingFor,
          verified: true,
        }).populate({
          path: "previousApplications",
          match: { agent: agentID },
        });
        if (studentFound) {
          return res.status(200).send(studentFound);
        } else {
          return res
            .status(500)
            .send({ message: "no verified student available" });
        }
      } else {
        const newAgent = await Agent({
          agentID: agentID,
          phone: phone,
          ...body,
          agentSince: date,
        });
        newAgent
          .save()
          .then((doc) => {
            Student.find({
              countryLookingFor: countryLookingFor,
              verified: true,
            })
              .populate({
                path: "previousApplications",
                match: { agent: agentID },
              })
              .exec((err, studentFound) => {
                if (studentFound) {
                  return res.status(200).send(studentFound);
                } else {
                  return res
                    .status(500)
                    .send({ message: "no verified student available" });
                }
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

const getStudentDoc = async (req, res) => {
  try {
    const { agentID, studentID } = req.body;
    if (!agentID || !studentID) {
      throw "One of important field missing AgentID or StudentID";
    }

    const agentData = await Agent.findOne({ agentID });
    console.log(agentData.documents);
    if (!agentData) {
      throw "Agent with given id doesn't exist";
    } else {
      if (
        agentData.documents.license &&
        agentData.documents.registrationCertificate &&
        agentData.documents.personalID
      ) {
        const studentData = await Student.findOne({ studentID });
        if (!studentData) {
          throw "Student with given id doesnt exist";
        } else {
          return res.status(200).send({ data: studentData.documents });
        }
      } else {
        throw "Agent should upload all documents";
      }
    }
  } catch (e) {
    return res.status(404).send(e);
  }
};

const agentDocCreate = async (req, res) => {
  try {
    const { agentID, documents } = req.body;
    if (!agentID) {
      throw "AgentID missing";
    }
    if (!documents.link) {
      throw "Link missing for Either one of the documents";
    }
    if (!documents.name) {
      throw "Name missing for Either one of the documents";
    }
    if (!documents.type) {
      throw "Type missing for documents";
    }
    const agentData = await Agent.findOne({ agentID });
    if (!agentData) {
      return res
        .status(400)
        .send({ message: "Agent with given id doesnt exist" });
    } else {
      const docFound = await AgentDoc.findOne({
        $and: [{ agentID: agentID }, { name: documents.name }],
      });

      if (docFound) {
        return res.status(400).send("Document already uploaded");
      } else {
        const doc = new AgentDoc({
          link: documents.link,
          name: documents.name,
          type: documents.type,
          agentID: agentID,
        });
        doc.save((err, result) => {
          if (result) {
            AgentDoc.find(
              {
                agentID: agentID,
              },
              (error, docFound) => {
                var count = 0;
                docFound.map((key) => {
                  if (
                    key.name == "license" ||
                    key.name == "registrationCertificate" ||
                    key.name == "personalID"
                  ) {
                    count++;
                  }
                });
                if (count == 3) {
                  agentData.verified = true;
                  agentData.documents.push(doc);
                  agentData.save();

                  return res.status(200).send({ message: agentData });
                } else {
                  agentData.documents.push(doc);
                  agentData.save((err, result) => {
                    if (err) {
                      return res.status(500).send(err);
                    } else {
                      return res.status(200).send({ message: agentData });
                    }
                  });
                }
              }
            );
          } else {
            return res.status(500).send(err.message);
          }
        });
      }
    }
  } catch (e) {
    return res.status(404).send(e.message);
  }
};

const updateAgentDoc = async (req, res) => {
  try {
    const { agentID, documentID, name } = req.body;
    if (!agentID || !documentID || !name) {
      throw "One of Important field missing agentID , DocumentId or Name";
    }
    AgentDoc.findOneAndUpdate(
      { _id: documentID },
      { name },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res
            .status(200)
            .send({ message: "document updated successfully", data: result });
        }
      }
    );
  } catch (e) {
    return res.status(404).send(e);
  }
};

const agentDeleteDoc = async (req, res) => {
  try {
    const { agentID, documentID } = req.body;
    //check if data is correct
    if (!agentID || !documentID) {
      throw "studentID or DocumentID missing";
    }
    const agentData = await Agent.findOne({ AgentID: agentID }); //find agent
    if (!agentData) {
      throw "agent with agentID doesnt exist";
    } else {
      AgentDoc.findByIdAndDelete(documentID, (err, document) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (document) {
          if (
            document.name === "license" ||
            document.name === "registrationCertificate" ||
            document.name === "personalID"
          ) {
            agentData.verified = false;
            agentData.save((err, doc) => {
              if (doc) {
                const response = {
                  message: "deleted successfully",
                  data: doc,
                };
                return res.status(200).send(response);
              } else {
                return res.status(500).send(e);
              }
            });
          }
        } else {
          return res.status(404).send("Document doesnt exist");
        }
      });
    }
  } catch (e) {
    return res.status(404).send(e);
  }
};

module.exports = {
  create,
  agentDocCreate,
  getStudentDoc,
  agentDeleteDoc,
  updateAgentDoc,
};
