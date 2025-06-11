const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/authenticateToken");
const LogoutController = require("../../controllers/register/LogoutController");

router.post("/logout", authenticateToken, LogoutController.logout);

module.exports = router;