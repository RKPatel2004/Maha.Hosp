const express = require("express");
const router = express.Router();
const { loginUser } = require("../../controllers/register/LoginController");

router.post("/login", loginUser);

module.exports = router;
