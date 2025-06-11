const express = require("express");
const router = express.Router();
const { CareerOpeningForm, 
    FilterDepartments, 
    getAllCareerOpening, 
    searchCareerOpening, 
    deleteCareerOpening, 
    editCareerOpening,
    getCareerInquiry,
    searchCareerInquiry } = require("../../../controllers/AdminUserMaster/Career/CareerOpeningController");
const authenticateToken = require("../../../middleware/authenticateToken");

router.post("/career-opening-form", authenticateToken, CareerOpeningForm);
router.post("/filter-department", authenticateToken, FilterDepartments);
router.get("/get-career-opening", authenticateToken, getAllCareerOpening);
router.post("/search-career-opening", authenticateToken, searchCareerOpening);
router.delete("/delete-career-opening/:id", authenticateToken, deleteCareerOpening);
router.put("/edit-career-opening/:id", authenticateToken, editCareerOpening);
router.get("/career-inquiry", authenticateToken, getCareerInquiry);
router.post("/search-career-inquiry", authenticateToken, searchCareerInquiry);

module.exports = router;