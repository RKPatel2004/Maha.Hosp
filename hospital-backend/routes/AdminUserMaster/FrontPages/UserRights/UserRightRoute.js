const express = require("express");
const router = express.Router();
const { searchUserRights } = require("../../../../controllers/AdminUserMaster/FrontPages/UserRights/UserRightController");
const authenticateToken = require("../../../../middleware/authenticateToken");

router.post("/search-user-rights", authenticateToken, searchUserRights);

module.exports = router;