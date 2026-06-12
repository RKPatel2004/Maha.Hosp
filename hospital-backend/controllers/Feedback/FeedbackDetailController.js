const FeedbackDetail_1 = require('../../models/FeedbackDetail_1');

async function generateAutoIncrementedId() {
    const lastFeedback = await FeedbackDetail_1.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

    return lastFeedback ? lastFeedback._id + 1 : 1;
}

const SubmitFeedbackDetail = async(req, res) => {
    try {
        const { FeedbackID, QuestionID, AnswerOptionID } = req.body;

        console.log("req.user:", req.user);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. Please login first."
            });
        }
        
        const UserID = req.user.userId;
        
        console.log("Extracted UserID:", UserID);
        
        if (!UserID) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token",
                userObject: req.user
            });
        }

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

        const _id = await generateAutoIncrementedId();

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