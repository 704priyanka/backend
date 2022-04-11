const Reviews = require("../models/reviews");
const Agent = require("../models/agent");
const Student = require("../models/student");

//create review by student

const review = async function (req, res) {
  const date = new Date().toLocaleDateString();
  const { studentID, agentID, content, stars, studentName } = req.body;
  let newReview = {
    agent: agentID,
    reviewerID: studentID,
    starsRated: stars,
    datePosted: date,
    reviewerName: studentName,
    reviewContent: content,
  };

  //find student exists or not
  const studentData = await Student.findOne({ studentID: studentID });
  if (studentData) {
    console.log(studentData);
  } else {
    console.log("Not Found");
  }
  if (studentData) {
    const review = await Reviews.findOne({
      agent: agentID,
      reviewerID: studentID,
    });
    if (review) {
      return res.status(500).send("Student has reviewed");
    } else {
      const review = Reviews.create(newReview);
      console.log("log");
    }
  }

  // //adding review in the agent collection
  // Reviews.findOne(
  //   { agent: agentID, reviewerID: studentID },
  //   (errorA, review) => {
  //     if (errorA) {
  //       return res.status(500).json({ errors: errorA.message });
  //     } else if (review) {
  //       return res.status(500).json({
  //         message: "Already student has a review for same mentor",
  //         review,
  //       });
  //     } else {
  //       Reviews.create(newReview, (errorB, reviewCreated) => {
  //         if (errorB) {
  //           return res.status(500).json({ errors: errorB.message });
  //         } else if (reviewCreated) {
  //           // Add it to the agent dataBase
  //           Agent.findOne({ agentID: agentID }, (errorC, foundAgent) => {
  //             if (errorC) {
  //               return res.status(500).json({ errors: errorC.message });
  //             } else {
  //               //  Add to agentreviews
  //               foundAgent.reviews.push(reviewCreated._id);
  //               let reviewStars;
  //               if (foundAgent.reviewAverage === 0) {
  //                 reviewStars = stars;
  //               } else {
  //                 reviewStars = (foundAgent.reviewAverage + stars) / 2;
  //               }

  //               foundAgent.reviewAverage = reviewStars;
  //               foundAgent.save();
  //             }
  //           });
  //           return res.status(201).send({
  //             message: "Successfully added a new review",
  //             data: reviewCreated,
  //           });
  //         }
  //       });
  //     }
  //   }
  // );
};

const displayReview = async function (req, res) {
  const { agentID, studentID } = req.body;
  let studentHasReviewed = false;
  Reviews.find({ agent: agentID }, (err, foundReviews) => {
    if (err) {
      return res.status(500).json({ errors: error.message });
    } else {
      const noOfReviews = foundReviews.length;
      foundReviews.forEach((review) => {
        if (review.reviewerID == studentID) {
          studentHasReviewed = true;
        }
      });
      return res.status(200).send({
        message: `Retrieved ${noOfReviews} Reviews`,
        data: foundReviews,
        studentHasReviewed,
      });
    }
  });
};

module.exports = {
  review,
  displayReview,
};
