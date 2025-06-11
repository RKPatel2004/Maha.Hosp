const express = require("express");
const router = express.Router();
const { editDoctor } = require("../../../controllers/AdminUserMaster/Doctor_Registration/EditDoctorController");
const { profileUpload } = require("../../../middleware/upload");
const authenticateToken = require("../../../middleware/authenticateToken");

// PUT route for editing doctor
// Using profileUpload.single("FilePath") for image file upload
router.put("/edit-doctor", authenticateToken, profileUpload.single("FilePath"), editDoctor);

module.exports = router;