const mongoose = require("mongoose");
/////////////////////////////////////////////
const AgentsSchema = new mongoose.Schema({
  agentID: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: " ",
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
  licenseNo: {
    type: String,
    requied: false,
    default: null,
  },
  agentSince: {
    type: Date,
    required: false,
    default: null,
  },
  martialStatus: {
    type: String,
    required: false,
    default: null,
  },
  applicationsHandled: {
    type: Number,
    required: true,
    default: 0,
  },
  applications: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "applications",
  },
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
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
  countryLookingFor: {
    type: String,
    required: true,
  },
  reviewAverage: {
    type: Number,
    required: true,
    default: 0.0,
  },
  bio: {
    type: String,
    required: false,
    default: null,
  },
  verified: {
    required: true,
    type: Boolean,
    default: false,
  },
});
/////////////////////////////////////////////
module.exports = mongoose.model("agents", AgentsSchema);
