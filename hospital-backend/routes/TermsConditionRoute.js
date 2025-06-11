const express = require("express");
const { getAllTermsConditions } = require("../controllers/TermsConditionController");
const router = express.Router();

router.get("/", getAllTermsConditions);

module.exports = router;