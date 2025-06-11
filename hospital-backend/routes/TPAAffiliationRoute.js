const express = require("express");
const router = express.Router();
const { getAllTPAAffiliation } = require("../controllers/TPAAffiliationController");

router.get("/TPAAffiliation", getAllTPAAffiliation);

module.exports = router;