const FeedbackDetail_1 = require('../../models/FeedbackDetail_1');

// Helper function to generate an auto-incremented _id
async function generateAutoIncrementedId() {
    // Find the document with the highest _id
    const lastFeedback = await FeedbackDetail_1.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

    // If collection is empty, start from 1, else increment the max _id by 1
    return lastFeedback ? lastFeedback._id + 1 : 1;
}

const SubmitFeedbackDetail = async(req, res) => {
    try {
        const { FeedbackID, QuestionID, AnswerOptionID } = req.body;

        // Debug: Check if req.user exists
        console.log("req.user:", req.user);
        
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. Please login first."
            });
        }
        
        // Get UserID from authenticated user token
        const UserID = req.user.userId;
        
        console.log("Extracted UserID:", UserID);
        
        if (!UserID) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token",
                userObject: req.user
            });
        }

        // Check if this specific question has already been answered for this feedback
        // This prevents duplicate answers for the same question in the same feedback session
        const existingQuestionAnswer = await FeedbackDetail_1.findOne({
            FeedbackID: FeedbackID,
            QuestionID: QuestionID,
            UserID: UserID
        });

        if (existingQuestionAnswer) {
            return res.status(409).json({
                success: false,
                message: "This question has already been answered for this feedback session."
            });
        }

        // Generate auto-incremented _id
        const _id = await generateAutoIncrementedId();

        // Create feedback detail with all required fields including UserID and SubmissionDate
        const feedbackDetailData = {
            _id,
            FeedbackID,
            QuestionID,
            AnswerOptionID,
            UserID: UserID,
            SubmissionDate: new Date()
        };

        console.log("Creating feedback detail with data:", feedbackDetailData);

        const feedbackDetail = new FeedbackDetail_1(feedbackDetailData);

        // Save the feedback detail and wait for completion
        const feedbackDetail_data = await feedbackDetail.save();
        
        console.log("Saved feedback detail:", feedbackDetail_data);
        
        res.status(200).json({
            success: true,
            message: "Feedback detail submitted successfully",
            data: feedbackDetail_data,
            _id
        });
    }
    catch(error){
        console.error("Error submitting feedback detail:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: error.message
        });
    }
};

module.exports = { SubmitFeedbackDetail };