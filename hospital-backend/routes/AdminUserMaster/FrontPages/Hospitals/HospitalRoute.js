const express = require("express");
const router = express.Router();
const { getAllHospitals, editHospital } = require("../../../../controllers/AdminUserMaster/FrontPages/Hospitals/HospitalController");
const authenticateToken = require("../../../../middleware/authenticateToken");

router.get("/get-all-hospitals", authenticateToken, getAllHospitals);
router.put("/edit-hospital", authenticateToken, editHospital);

module.exports = router;