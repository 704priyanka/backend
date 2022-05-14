const Student = require("../models/student");
const Agent = require("../models/agent");
const Application = require("../models/applications");
const StudentDoc = require("../models/studentDoc");

var create = async function (req, res) {
  try {
    let body = req.body;

    const { studentID, phone, countryLookingFor } = req.body;
    if (!studentID || !phone || !countryLookingFor) {
      return res.status(401).send({
        message: `One of the imported fields is missing phone:${!phone} studnetID:${!studentID} countryLookingFor:${!countryLookingFor}`,
      });
    }

    //find student id already registered as agent
    const agentFound = await Agent.findOne({ agentID: studentID });

    if (agentFound) {
      return res
        .status(403)
        .send({ message: "You have an account already as an agent" });
    } else {
      const studentFound = await Student.findOne({ studentID })
        .populate("documents") //find student in document collection
        .populate({
          //find student in application submitted
          path: "previousApplications",
          populate: {
            path: "agent",
            select: ["agentID", "name", "photo"],
          },
        });

      if (studentFound) {
        const agentFound = await Agent.find({
          countryLookingFor: countryLookingFor,
          verified: true,
        });

        if (agentFound.length == 0) {
          return res.status(200).send({
            message: "Successfully retrieved the data",
            student: studentFound,
            agents: "NO verfied agent available",
          });
        } else {
          return res.status(200).send({
            message: "Successfully retrieved the data",
            student: studentFound,
            agents: agentFound,
          });
        }
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
              {
                countryLookingFor: countryLookingFor,
                verified: true,
              },
              (error, agentFound) => {
                if (error) {
                  return res.send(500).send({ error: error.message });
                }
                if (agentFound.length == 0) {
                  return res.status(200).send({
                    message: "Successfully retrieved the data",
                    student: doc,
                    agents: "NO verfied agent available",
                  });
                } else {
                  return res.status(200).send({
                    message: "Successfully retrieved the data",
                    student: doc,
                    agents: agentFound,
                  });
                }
              }
            );
          })
          .catch((e) => {
            return res.send(500).send({ error5: e.message });
          });
      }
    }
  } catch {
    (e) => {
      return res.send(500).send({ error5: e.message });
    };
  }
};

const studentDataUpdate = async (req, res) => {
  try {
    const { studentID } = req.body;
    if (!studentID) {
      throw "studentID missing";
    }
    const data = req.body;
    delete data.studentID;
    const studentData = await Student.findOneAndUpdate({ studentID }, data, {
      new: true,
    });
    if (studentData) {
      return res.status(200).send({
        message: "successfully updated",
        data: studentData,
      });
    } else {
      return res
        .status(404)
        .send({ message: "Student with given ID doesnt exist" });
    }
  } catch (e) {
    return res.status(404).send(e);
  }
};

const createDoc = async (req, res) => {
  try {
    const { studentID, documents } = req.body;

    if (!studentID) {
      throw "student id missing";
    }
    const studentData = await Student.findOne({ studentID: studentID });
    if (!studentData) {
      //check student exist or not
      throw "Student not Found";
    } else {
      if (!documents.link || !documents.name || !documents.type) {
        //document fields ok or not
        throw "One of important field in document missing";
      }
      const docFound = await StudentDoc.findOne({
        $and: [{ studentID: studentID }, { name: documents.name }],
      });

      if (docFound) {
        return res.status(401).send("Document already uploaded");
      } else {
        const doc = new StudentDoc({
          link: documents.link,
          name: documents.name,
          type: documents.type,
          studentID: studentID,
        });
        doc.save((err, result) => {
          if (result) {
            StudentDoc.find(
              {
                studentID: studentID,
              },
              (error, docFound) => {
                var count = 0;
                docFound.map((key) => {
                  if (
                    key.name == "passport" ||
                    key.name == "englishProficiencyTest" ||
                    key.name == "academics"
                  ) {
                    count++;
                  }
                });
                if (count == 3) {
                  studentData.verified = true;
                  studentData.documents.push(doc);
                  studentData.save();
                  return res.status(200).send({ message: studentData });
                } else {
                  studentData.documents.push(doc);
                  studentData.save((err, result) => {
                    if (err) {
                      return res.status(500).send(err);
                    } else {
                      return res.status(200).send({ message: studentData });
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
    return res.status(404).send(e);
  }
};

//update documents

const updateDoc = (req, res) => {
  try {
    const { studentID, documentID, name } = req.body;
    if (!studentID || !documentID || !name) {
      throw "One of Important field missing studentID , DocumentId or Name";
    }
    StudentDoc.findOneAndUpdate(
      { _id: documentID, studentID: studentID },
      { name },
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(404).send(err);
        }
        if (result) {
          return res
            .status(200)
            .send({ message: "document updated successfully", data: result });
        } else {
          return res.status(404).send({ message: "Document not found" });
        }
      }
    );
  } catch (e) {
    return res.status(404).send(e);
  }
};

//for deleting a document

const deleteDoc = async (req, res) => {
  try {
    const { studentID, documentID } = req.body;
    //check if data is correct
    if (!studentID || !documentID) {
      throw "studentID or DocumentID missing";
    }
    const studentData = await Student.findOne({ studentID: studentID }); //find student
    if (!studentData) {
      throw "student with studentID doesnt exist";
    } else {
      studentData.documents = await studentData.documents.filter((doc) => {
        return doc != documentID;
      });

      StudentDoc.findByIdAndDelete(documentID, (err, document) => {
        if (err) {
          return res.status(500).send(err);
        }
        if (document) {
          if (
            document.name === "passport" ||
            document.name === "englishProficiencyTest" ||
            document.name === "academics"
          ) {
            studentData.verified = false;
            studentData.save((err, doc) => {
              if (doc) {
                const response = {
                  message: "deleted successfully",
                  data: doc,
                };
                return res.status(200).send(response);
              } else {
                return res.status(500).send(err);
              }
            });
          } else {
            studentData.save((err, doc) => {
              if (doc) {
                return res
                  .status(200)
                  .send({ message: "Delete succesfully", data: doc });
              } else {
                return res.status(500).send(err);
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

const addApplication = async function (req, res) {
  try {
    const { applicationID, agentID, studentID } = req.body;

    if (!applicationID || !agentID || !studentID) {
      return res.status(401).send({
        message: `Some of the data missing applicationId , agentID , studentID`,
      });
    } else {
      const studentFound = await Student.findOne({ studentID }).populate(
        "previousApplications"
      );

      if (!studentFound) {
        return res.status(500).send({
          message: `student does not exists`,
        });
      }
      console.log(studentFound);

      if (studentFound.verified == true) {
        const agentFound = await Agent.findOne({ agentID: agentID });
        if (!agentFound) {
          return res
            .status(401)
            .send({ message: "agent with this ID does not exists" });
        } else {
          Application.findOne({ _id: applicationID })
            .populate("agent")
            .populate("student")
            .exec((err, applicationFound) => {
              if (err || !applicationFound) {
                return res.status(500).send({
                  message: "Applcation with given id not found",
                  err: err ? err : "Server can't update",
                });
              } else {
                if (
                  applicationFound.agent.agentID === agentID &&
                  applicationFound.student.studentID === studentID
                ) {
                  if (applicationFound["accepted"] == true) {
                    return res.status(401).send({
                      message: "Applcation already accepted",
                    });
                  } else {
                    applicationFound["accepted"] = true;
                    agentFound.applicationsHandled =
                      agentFound.applicationsHandled + 1;
                    agentFound.save();
                    console.log(agentFound);
                    applicationFound.status = 3;
                    applicationFound.save((err, applicationUpdated) => {
                      if (err || !applicationUpdated) {
                        return res.status(401).send({
                          message:
                            "Somethiing went wrong while updatin the application",
                          err: err ? err : "Server can't update",
                        });
                      } else {
                        res.status(200).send({
                          message: "Succussefully accepted the application",
                          data: applicationUpdated,
                        });
                      }
                    });
                  }
                } else {
                  return res.status(500).send({
                    message: "student/agent with given id not found",
                  });
                }
              }
            });
        }
      } else {
        return res.status(500).send({
          message: "student is not verified",
        });
      }
    }
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
};

module.exports = {
  create,
  createDoc,
  updateDoc,
  deleteDoc,
  addApplication,
  studentDataUpdate,
};
