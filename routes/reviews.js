const express = require("express");
const router = express.Router();

const reviewAdd = require("../controller/reviews");
/* GET home page. */
router.post("/all", reviewAdd.displayReview);
router.post("/create", reviewAdd.review);

module.exports = router;
