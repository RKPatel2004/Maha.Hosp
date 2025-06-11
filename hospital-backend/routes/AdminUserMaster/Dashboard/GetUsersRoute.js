const express = require("express");
const router = express.Router();
const { getAllPatients, getAllDoctors, getFilteredPatients, getFilteredDoctors } = require("../../../controllers/AdminUserMaster/Dashboard/GetUsersController");
const verifyToken = require("../../../middleware/authenticateToken");

router.get("/patients", verifyToken, getAllPatients);
router.post("/filter-patients", verifyToken, getFilteredPatients);

router.get("/doctors", verifyToken, getAllDoctors);
router.post("/filter-doctors", verifyToken, getFilteredDoctors);

module.exports = router;