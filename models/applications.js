const mongoose = require("mongoose");
/////////////////////////////////////////////
const ApplicationSchema = new mongoose.Schema({
  universityName: {
    type: String,
    required: true,
  },
  location: {
    city: { type: String, default: null },
    country: { type: String, default: null },
  },
  applicationFees: {
    type: Number,
    required: true,
  },
  courseFees: {
    type: Number,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "agents",
    required: true,
  },
  favourite: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
    max: 4,
    min: 0,
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  accepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  courseLink: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
  },
});
/////////////////////////////////////////////
module.exports = mongoose.model("applications", ApplicationSchema);
