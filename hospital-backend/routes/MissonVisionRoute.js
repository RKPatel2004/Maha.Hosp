const express = require("express");
const router = express.Router();
const { getAllMissonVision } = require("../controllers/MissonVisionController");

router.get("/misson-vision", getAllMissonVision);

module.exports = router;