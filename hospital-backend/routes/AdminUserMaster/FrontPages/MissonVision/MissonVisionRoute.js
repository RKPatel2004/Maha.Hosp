const express = require("express");
const router = express.Router();
const { getAllMissonVision, updateMissonVision } = require("../../../../controllers/AdminUserMaster/FrontPages/MissonVision/MissonVisionController");
const authenticateToken = require("../../../../middleware/authenticateToken");

router.get("/get-all-misson-vision", authenticateToken, getAllMissonVision);
router.put("/update-misson-vision/:id", authenticateToken, updateMissonVision);

module.exports = router;