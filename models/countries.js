const mongoose = require("mongoose");
/////////////////////////////////////////////////////
const CountrySchema = new mongoose.Schema({
  countryName: {
    type: String,
    required: true,
    unique: true,
  },
  countryImages: [
    {
      url: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
  _id: {
    required: true,
    unique: true,
    type: String,
  },
});

/////////////////////////////////////////////////////
module.exports = mongoose.model("country", CountrySchema);
