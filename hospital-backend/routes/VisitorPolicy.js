const express = require("express");
const router = express.Router();
const { getAllVisitorPolicies } = require("../controllers/VisitorPolicyController");

router.get("/", getAllVisitorPolicies);

module.exports = router;