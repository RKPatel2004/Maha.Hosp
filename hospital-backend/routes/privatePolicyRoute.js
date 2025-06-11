const express = require("express");
const { getAllPrivatePolicies, getPrivatePolicyById } = require("../controllers/privatePolicyController");

const router = express.Router();

router.get("/", getAllPrivatePolicies);

router.get("/:id", getPrivatePolicyById);

module.exports = router;