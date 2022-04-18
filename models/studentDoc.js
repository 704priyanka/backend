const mongoose = require("mongoose");

const studentDocSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  studentID: {
    type: String,
    ref: "student",
    required: true,
  },
});

module.exports = mongoose.model("studentDoc", studentDocSchema);
