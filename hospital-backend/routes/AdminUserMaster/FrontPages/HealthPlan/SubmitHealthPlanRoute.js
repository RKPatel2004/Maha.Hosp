const express = require("express");
const router = express.Router();
const { healthPlanUpload } = require("../../../../middleware/upload");
const { submitHealthPlan, editHealthPlan  } = require("../../../../controllers/AdminUserMaster/FrontPages/HealthPlan/SubmitHealthPlanController");
const authenticateToken = require("../../../../middleware/authenticateToken");

const fs = require('fs');
const path = require('path');

const uploadDirs = [
  'uploads/health-plans',
  'uploads/health-plans/images',
  'uploads/health-plans/files'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

router.post("/submit-health-plan",
  authenticateToken,  
  healthPlanUpload.any(), 
  submitHealthPlan
);

router.put("/edit-health-plan/:id",
  authenticateToken,  
  healthPlanUpload.any(), 
  editHealthPlan
);

module.exports = router;