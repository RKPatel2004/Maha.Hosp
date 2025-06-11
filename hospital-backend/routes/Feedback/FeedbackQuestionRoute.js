const express = require("express");
const router = express.Router();

const { getAllFeedbackQuestion } = require("../../controllers/Feedback/FeedbackQuestionController");

router.get("/feedback-question", getAllFeedbackQuestion);

module.exports = router;