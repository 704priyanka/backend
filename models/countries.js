const mongoose = require("mongoose");
/////////////////////////////////////////////////////
const CountrySchema = new mongoose.Schema({
  countryName: {
    type: String,
    required: true,
    unique: true,
  },
  _id: {
    type: String,
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
      _id: false,
    },
  ],
});

/////////////////////////////////////////////////////
module.exports = mongoose.model("country", CountrySchema);
