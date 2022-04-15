const mongoose = require("mongoose");
/////////////////////////////////////////////////////
const StudentSchema = new mongoose.Schema({
  studentID: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: "  ",
  },
  email: {
    type: String,
    required: false,
    default: null,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    requied: false,
    default: null,
  },
  DOB: {
    type: Date,
    required: false,
    default: null,
  },
  martialStatus: {
    type: String,
    required: false,
    default: null,
  },
  marksheet: {
    _: { type: String, default: "PTE" },
    Overall: { type: String, default: 29 },
    L: { type: String, default: 12 },
    W: { type: String, default: 15 },
    S: { type: String, default: 22 },
    R: { type: String, default: 43 },
  },

  previousApplications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applications",
    },
  ],
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "documents",
    },
  ],
  location: {
    city: { type: String, default: null },
    country: { type: String, default: null },
  },
  countryLookingFor: {
    type: String,
    required: true,
  },
  verified: {
    required: true,
    type: Boolean,
    default: false,
  },
});

/////////////////////////////////////////////////////
module.exports = mongoose.model("student", StudentSchema);
