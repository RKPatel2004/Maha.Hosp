const express = require("express");
const { getDoctorByMobile } = require("../../../controllers/AdminUserMaster/Doctor_Registration/GetDoctorController");
const authenticateToken = require("../../../middleware/authenticateToken");
const router = express.Router();

// POST route to retrieve doctor by mobile number
router.post("/retrieve-doctor", authenticateToken, getDoctorByMobile);

module.exports = router;