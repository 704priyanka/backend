var express = require("express");
var router = express.Router();
const country = require("../controller/country");
/* GET home page. */
router.post("/add", country.add);
router.get("/", country.displayCountries);
router.post("/single", country.displayCountry);

module.exports = router;
