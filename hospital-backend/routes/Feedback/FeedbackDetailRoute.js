const express = require("express");
const router = express.Router();
const { SubmitFeedbackDetail } = require("../../controllers/Feedback/FeedbackDetailController");

router.post("/feedback-detail", SubmitFeedbackDetail);

module.exports = router;