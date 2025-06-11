const express = require("express");
const router = express.Router();
const { SubmitDepartment, DeleteDepartment } = require("../../../controllers/AdminUserMaster/Department/DepartmentController");
const authenticateToken = require("../../../middleware/authenticateToken");

router.post("/submit-department", authenticateToken, SubmitDepartment);

router.delete("/delete-department/:id", authenticateToken, DeleteDepartment);

module.exports = router;