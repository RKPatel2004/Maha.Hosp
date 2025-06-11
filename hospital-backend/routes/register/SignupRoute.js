const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, registerUser } = require("../../controllers/register/SignupController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/final-signup", registerUser);

module.exports = router;
