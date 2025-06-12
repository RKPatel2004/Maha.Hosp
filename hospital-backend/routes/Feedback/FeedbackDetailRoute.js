const express = require("express");
const router = express.Router();
const { SubmitFeedbackDetail } = require("../../controllers/Feedback/FeedbackDetailController");
const authenticateToken = require("../../middleware/authenticateToken");

router.post("/feedback-detail", authenticateToken, SubmitFeedbackDetail);

module.exports = router;