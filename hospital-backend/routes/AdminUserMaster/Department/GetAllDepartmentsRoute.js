const express = require("express");
const router = express.Router();
const { getAllDepartments, editDepartment, searchDepartment } = require("../../../controllers/AdminUserMaster/Department/GetAllDepartmentsController");
const authenticateToken = require("../../../middleware/authenticateToken");

router.get("/get-all-departments", authenticateToken, getAllDepartments);
router.put("/edit-department/:id", authenticateToken, editDepartment);
router.post("/search-department", authenticateToken, searchDepartment);

module.exports = router;