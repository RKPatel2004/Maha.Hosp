const express = require("express");
const router = express.Router();
const { SubmitFeedbackForm } = require("../../controllers/Feedback/FeedbackFormController");

router.post("/feedback-form", SubmitFeedbackForm);

module.exports = router;