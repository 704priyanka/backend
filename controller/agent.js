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
            return res.status(500).send({ error: err.message });
          });
      }
    }
  } catch {
    (error) => {
      return res.status(500).send({ message: error.message });
    };
  }
};

const getStudentDoc = (req, res) => {
  try {
    const { agentID, studentID } = req.body;
    if (!agentID || !studentID) {
      throw "One of important field missing AgentID or StudentID";
    }
  } catch (e) {
    return res.status(404).send(e);
  }
};

// // GET STUDENT DOCS
// router.post("/getStudent/doc", (req, res) => {
//   try {
//     let body;
//     try {
//       body = req.body;
//     } catch (error) {
//       return res.status(400).send({
//         error: "INVALID BODY REQUEST DATA ",
//       });
//     }
//     const { agentID, studentID } = body;

//     Agent.findOne({ agentID }, (error, agent) => {
//       if (error || !agent) {
//         return res
//           .status(404)
//           .send({ message: "Agent with given id not found", error: error });
//       } else if (agent) {
//         if (
//           agent.requiredDocuments.license &&
//           agent.requiredDocuments.registrationCertificate &&
//           agent.requiredDocuments.personalID
//         ) {
//           Student.findOne({ studentID }, (errorA, student) => {
//             if (errorA || !student) {
//               return res.status(404).send({
//                 message: "Student not found",
//                 error: errorA,
//               });
//             } else if (student) {
//               return res.status(200).send({
//                 primary: student.requiredDocuments,
//                 others: student.otherDocuments,
//               });
//             }
//           });
//         } else {
//           return res.status(500).send({
//             message: "Agent needs to upload all the required documents",
//           });
//         }
//       }
//     });
//   } catch (errorMain) {
//     return res.status(500).send({
//       message: "Something Went Wrong",
//       error: errorMain ? errorMain : "Error occured ",
//     });
//   }
// });

// // For documents of agent update
// router.post("/doc", async (req, res) => {
//   let body;
//   try {
//     body = req.body;
//   } catch (error) {
//     return res.status(400).send({
//       error: "INVALID BODY REQUEST DATA ",
//     });
//   }
//   const { agentID, documents } = body;
//   try {
//     Agent.findOne({ agentID }, (errorA, agentFound) => {
//       if (errorA || !agentFound) {
//         return res.status(500).send({
//           message: "agent not found with given id or internal problem",
//           error: errorA,
//         });
//       } else {
//         try {
//           if (!documents.link) {
//             throw Error("Link missing for Either one of the documents");
//           }
//           if (!documents.name) {
//             throw Error("Name missing for Either one of the documents");
//           }
//           if (!documents.type) {
//             throw Error("Type missing for documents documents");
//           }
//           let newDocument = {
//             link: documents.link,
//             name: documents.name,
//             type: documents.type,
//           };
//           // To adding the dta ainto other documents field
//           Documents.create(newDocument, (errorDoc, createdDocument) => {
//             if (errorDoc || !createdDocument) {
//               return res.status(400).send({
//                 message: "Something went wrong in backend",
//                 error: errorDoc ? errorDoc : "Document creation failed",
//               });
//             } else {
//               agentFound.documents.push(createdDocument);
//               agentFound.save((err, agentUpdated) => {
//                 if (err || !agentUpdated) {
//                   throw Error(
//                     err.message
//                       ? err.message
//                       : "agent updation problem something went wrong"
//                   );
//                 } else {
//                   return res
//                     .status(200)
//                     .send({ message: "Data updated", data: agentUpdated });
//                 }
//               });
//             }
//           });
//         } catch (errorZ) {
//           return res.status(400).send({
//             message: "Error while updating the document",
//             error: errorZ.message,
//           });
//         }
//       }
//     });
//   } catch (errorMain) {
//     return res.status(500).send({
//       message: "Something Went Wrong",
//       error: errorMain ? errorMain : "Error occured ",
//     });
//   }
// });

// // For updating the documents
// router.put("/doc", (req, res) => {
//   try {
//     let body;
//     try {
//       body = req.body;
//     } catch (error) {
//       return res.status(400).send({
//         error: "INVALID BODY REQUEST DATA ",
//       });
//     }
//     const { agentID, documentID, name } = body;
//     Documents.findByIdAndUpdate(
//       documentID,
//       { name },
//       { new: true },
//       (error, foundDocument) => {
//         if (error || !foundDocument) {
//           return res
//             .status(500)
//             .send({ message: "Something Went Wrong", error });
//         } else {
//           return res.status(201).send({
//             message: "Successfully Updated the data",
//             data: foundDocument,
//           });
//         }
//       }
//     );
//   } catch (errorMain) {
//     return res.status(500).send({
//       message: "Something Went Wrong",
//       error: errorMain ? errorMain : "Error occured ",
//     });
//   }
// });

// //For deleting a document
// router.delete("/doc", (req, res) => {
//   try {
//     let body;
//     try {
//       body = req.body;
//     } catch (error) {
//       return res.status(400).send({
//         error: "INVALID BODY REQUEST DATA ",
//       });
//     }
//     const { agentID, documentID } = body;
//     Agent.findOne({ agentID }, (errorA, agentFound) => {
//       if (errorA || !agentFound) {
//         return res.status(500).send({
//           message: "agent not found with given id or internal problem",
//           error: errorA,
//         });
//       } else {
//         agentFound.documents = agentFound.documents.filter(
//           (item) => item != documentID
//         );
//         agentFound.save((err, agentUpdated) => {
//           if (err || !agentUpdated) {
//             throw Error(
//               err.message
//                 ? err.message
//                 : "Agent updation problem something went wrong"
//             );
//           } else {
//             Documents.findByIdAndDelete(documentID, (error, foundDocument) => {
//               if (error || !foundDocument) {
//                 return res
//                   .status(500)
//                   .send({ message: "Something Went Wrong", error });
//               } else {
//                 return res.status(201).send({
//                   message: "Successfully deleted the data",
//                   data: foundDocument,
//                 });
//               }
//             });
//           }
//         });
//       }
//     });
//   } catch (errorMain) {
//     return res.status(500).send({
//       message: "Something Went Wrong",
//       error: errorMain ? errorMain : "Error occured ",
//     });
//   }
// });

// /////////////////////////////////////////
// module.exports = router;

// async function studentCheckApplication(studentList, agentID) {
//   var students = [];
//   // console.log("---------------", studentList);
//   // const studentValidate = async () =>
//   const studentValidate = async () => {
//     for (const student of studentList) {
//       // console.log("---------------", student);
//       student.optionStatus = null;
//       await Application.find(
//         {
//           student: student._id,
//           agent: agentID,
//         },
//         (error, applicationFound) => {
//           // console.log("Application Found", applicationFound);
//           if (error) {
//             // console.log("\\\\\\\\\\\\\\\\", error);
//             throw "Student Data resolving issue";
//           } else if (!applicationFound) {
//             let studentApplicationInfo = {
//               student,
//               optionStatus: 0,
//             };
//             // console.log("\\\\\\\\\\\\\\\\No application", student);
//             students.push(studentApplicationInfo);
//           } else if (!applicationFound.accepted) {
//             let studentApplicationInfo = {
//               student,
//               optionStatus: 1,
//             };
//             students.push(studentApplicationInfo);
//             // console.log("\\\\\\\\\\FALSE", students);
//           } else if (applicationFound.accepted) {
//             let studentApplicationInfo = {
//               student,
//               optionStatus: 2,
//             };
//             students.push(studentApplicationInfo);
//             // console.log("\\\\\\\\\\True", student);
//           }
//         }
//       );
//     }
//     console.log("Student", students.length);
//     return students;
//   };
//   const studentData = await studentValidate();

//   studentData.forEach((student) => {
//     console.log("<<<<<<<<<<<<<<<<", student.optionStatus, ">>>>>>>>>>>>>>");
//   });

//   // console.log("<<<<<<<<<<<<<<<<", studentList[1].__proto__, ">>>>>>>>>>>>>>");
//   return studentData;
// }

module.exports = { create };
