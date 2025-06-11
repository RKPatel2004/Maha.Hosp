const express = require("express");
const router = express.Router();
const { getUserProfile, editUserProfile } = require("../../controllers/register/UserProfileController");
const verifyToken = require("../../middleware/authenticateToken");
const { profileUpload } = require("../../middleware/upload");

router.get("/get-user-profile", verifyToken, getUserProfile);

router.put("/edit-user-profile", 
    verifyToken, 
    profileUpload.single('imagePath'), 
    editUserProfile
);

module.exports = router;