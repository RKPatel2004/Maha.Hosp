const express = require("express");
const router = express.Router();
const { getAllHealthPlans } = require("../controllers/HealthPlanMasterController");

// Route to get all health plans with populated references
router.get("/", getAllHealthPlans);

module.exports = router;