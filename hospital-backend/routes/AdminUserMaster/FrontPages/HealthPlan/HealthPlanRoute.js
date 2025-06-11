const express = require("express");
const router = express.Router();
const { getAllHealthPlans, deleteHealthPlan, searchHealthPlan } = require("../../../../controllers/AdminUserMaster/FrontPages/HealthPlan/HealthPlanController");
const authenticateToken = require("../../../../middleware/authenticateToken");

router.get("/get-all-health-plans", authenticateToken, getAllHealthPlans);
router.delete("/delete-health-plan/:id", authenticateToken, deleteHealthPlan);
router.post("/search-health-plan", authenticateToken, searchHealthPlan);

module.exports = router;