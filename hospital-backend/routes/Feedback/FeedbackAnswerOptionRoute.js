const express= require("express");
const router = express.Router();
const { getAllFeedbackAnswerOption } = require("../../controllers/Feedback/FeedbackAnswerOptionController");

router.get("/feedback-answer-option", getAllFeedbackAnswerOption);

module.exports = router;