const express = require("express");
const router = express.Router();
const { SubmitCareerForm } = require("../controllers/CareerFormController");
const upload = require("../middleware/upload");

router.post("/career-from", upload.single("resume"), SubmitCareerForm);

module.exports = router;
