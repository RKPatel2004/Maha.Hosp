const express = require("express");
const router = express.Router();
const { getAllHospitals } = require("../controllers/HospitalMasterController.js"); 

router.get("/", getAllHospitals);

module.exports = router;

