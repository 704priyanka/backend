const Reviews = require("../models/reviews");
const Agent = require("../models/agent");
const Student = require("../models/student");
const student = require("../models/student");

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

  const studentFound = await Student.findOne({ studentID });
  if (!studentFound) {
    res.status(200).send({ message: "Student not found" });
  } else if (studentFound) {
    //agent student exists or not
    const agentFound = await Agent.findOne({ agentID });
    if (!agentFound) {
      return res.status(200).send({ message: "Agent not found" });
    } else {
      //adding review in the agent collection
      const review = await Reviews.findOne({
        $and: [{ agent: agentID }, { reviewerID: studentID }],
      });
      if (review) {
        return res.status(500).json({
          message: "Already student has a review for same mentor",
          review,
        });
      } else {
        Reviews.create(newReview, (errorB, reviewCreated) => {
          if (errorB) {
            return res.status(500).json({ errors: errorB.message });
          } else if (reviewCreated) {
            // Add it to the agent dataBase

            //  Add to agent:reviews
            agentFound.reviews.push(reviewCreated._id);
            let reviewStars;
            if (agentFound.reviewAverage === 0) {
              reviewStars = stars;
            } else {
              reviewStars = (agentFound.reviewAverage + stars) / 2;
            }

            agentFound.reviewAverage = reviewStars;
            agentFound.save();

            return res.status(201).send({
              message: "Successfully added a new review",
              data: reviewCreated,
            });
          }
        });
      }
    }
  }
};

const displayReview = async function (req, res) {
  const { agentID, studentID } = req.body;
  let studentHasReviewed = false;
  Reviews.find({ agent: agentID }, (err, foundReviews) => {
    if (err) {
      return res.status(500).json({ errors: error.message });
    } else {
      const noOfReviews = foundReviews.length;
      const reviews = new Array();
      foundReviews.forEach((review) => {
        if (review.reviewerID == studentID) {
          studentHasReviewed = true;

          reviews.push({ review, studentHasReviewed: studentHasReviewed });
        } else {
          studentHasReviewed = false;
          reviews.push({ review, studentHasReviewed: studentHasReviewed });
        }
      });

      return res.status(200).send({
        message: `Retrieved ${noOfReviews} Reviews`,
        data: reviews,
      });
    }
  });
};

module.exports = {
  review,
  displayReview,
};
