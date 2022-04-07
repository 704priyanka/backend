const { Schema } = require("mongoose");
const mongoose = require("mongoose");
/////////////////////////////////////////////
const ReviewsSchema = new mongoose.Schema(
  {
    reviewerName: {
      type: String,
      required: true,
    },
    reviewerID: {
      type: String,
      ref: "student",
      required: true,
    },
    agent: {
      type: String,
      ref: "agents",
      required: true,
    },
    starsRated: {
      type: Number,
      required: true,
    },
    datePosted: {
      type: String,
      required: true,
    },
    reviewContent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
/////////////////////////////////////////////
module.exports = mongoose.model("reviews", ReviewsSchema);
