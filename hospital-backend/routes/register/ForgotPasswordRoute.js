// File: routes/register/ForgotPasswordRoute.js
const express = require("express");
const router = express.Router();
const forgotPasswordController = require("../../controllers/register/ForgotPasswordController");

// Step 1: Send OTP if MobileNo exists
router.post("/forgot-password/send-otp", forgotPasswordController.sendOtpIfUserExists);

// Step 2: Verify OTP
router.post("/forgot-password/verify-otp", forgotPasswordController.verifyOtp);

// Step 3: Reset Password
router.post("/forgot-password/reset-password", forgotPasswordController.resetPassword);

module.exports = router;
