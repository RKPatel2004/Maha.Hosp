const express = require("express");
const router = express.Router();
const { SubmitFeedbackQuestion, 
        DeleteFeedbackQuestion, 
        getAllFeedbackQuestion, 
        SearchFeedbackQuestion,
        editFeedbackQuestion,
        SearchFeedbackReport } = require("../../../controllers/AdminUserMaster/Feedback/FeedbackQuestionController");
const authenticateToken = require("../../../middleware/authenticateToken");

router.post("/submit-feedback-question", authenticateToken, SubmitFeedbackQuestion);
router.delete("/delete-feedback-question/:id", authenticateToken, DeleteFeedbackQuestion);
router.get("/get-feedback-question", authenticateToken, getAllFeedbackQuestion);
router.post("/search-feedback-question", authenticateToken, SearchFeedbackQuestion);
router.put("/edit-feedback-question/:id", authenticateToken, editFeedbackQuestion);
router.post("/search-feedback-report", authenticateToken, SearchFeedbackReport);

module.exports = router;