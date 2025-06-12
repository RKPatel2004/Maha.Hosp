const express = require("express");
const router = express.Router();
const { SubmitFeedbackForm } = require("../../controllers/Feedback/FeedbackFormController");
const authenticateToken = require("../../middleware/authenticateToken");

router.post("/feedback-form", authenticateToken, SubmitFeedbackForm);

module.exports = router;