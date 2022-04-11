let Country = require("../models/countries");

const add = async function (req, res) {
  const { countryID, countryName, countryImages } = req.body;
  try {
    /*if (!countryID || !countryName || !countryImages) {
      res.status(500).send({
        message: `one of the filed is empty countryID:${!countryID} ,countryImage:${!countryImages},countryName:${!countryName}`,
      });
    }*/

    countryFound = await Country.findOne({ _id: countryID });

    if (countryFound) {
      return res
        .status(403)
        .send({ message: "Already country exists with the given id" });
    } else {
      const newCountry = new Country({
        _id: countryID,
        countryName,
        countryImages,
      });

      newCountry
        .save()
        .then((doc) => {
          return res.status(200).json({
            message: "Successfully added a country",
            data: doc,
          });
        })
        .catch((error) => {
          res.status(500).send({ error: error.message });
        });
    }
  } catch {
    (error) => {
      res.status(500).send({ error: error.message });
    };
  }
};

const displayCountries = async function (req, res) {
  try {
    var foundCountries = await Country.find({});
    if (foundCountries) {
      const noOfCountries = foundCountries.length;
      return res.status(200).send({
        message: `Retrieved ${noOfCountries} countries`,
        data: foundCountries,
      });
    }
  } catch {
    (error) => {
      res.status(500).send({ error: error.message });
    };
  }
};

const displayCountry = async function (req, res) {
  try {
    const countryID = req.body;
    console.log(countryID);
    const countryFound = await Country.find({ _id: countryID });

    if (countryFound.length > 0) {
      const noOfCountries = countryFound.length;
      console.log(noOfCountries);
      return res.status(200).send({
        message: `Retrieved ${noOfCountries} countries`,
        data: countryFound,
      });
    } else {
      return res.status(500).send({ message: "no country available" });
    }
  } catch {
    (error) => {
      res.status(500).send({ error: error.message });
    };
  }
};

module.exports = {
  add,
  displayCountries,
  displayCountry,
};
