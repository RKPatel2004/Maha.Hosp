const express = require("express");
const router = express.Router();
const { getHospitalHistoryByHospitalId } = require("../controllers/HospitalHistoryController");

// Route to get hospital history by Hospital ID
router.get("/hospital-history/:id", getHospitalHistoryByHospitalId);

module.exports = router;