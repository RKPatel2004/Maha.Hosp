const express = require("express");
const router = express.Router();
const { profileUpload } = require("../../../middleware/upload");
const authenticateToken = require("../../../middleware/authenticateToken");
const { registerDoctor, getDoctor } = require("../../../controllers/AdminUserMaster/Doctor_Registration/DoctorRegistrationController");

// Register Doctor - Protected route
router.post(
    "/register-doctor", 
    authenticateToken, 
    profileUpload.single("FilePath"), 
    registerDoctor
);

router.post("/get-doctor", authenticateToken, getDoctor);

module.exports = router;