const express = require("express");
const router = express.Router();
const { adminLoginUser } = require("../../controllers/register/AdminLoginController");

// POST /MahavirHospital/api/admin-login
router.post("/admin-login", adminLoginUser);

module.exports = router;
