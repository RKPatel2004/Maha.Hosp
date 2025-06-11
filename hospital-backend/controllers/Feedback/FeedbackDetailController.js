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

const SubmitFeedbackDetail = async(req, res) =>{
    try {
        const {FeedbackID, QuestionID, AnswerOptionID} = req.body;

        // Generate auto-incremented _id
        const _id = await generateAutoIncrementedId();

        const feedbackDetail = new FeedbackDetail_1({
            _id,
            FeedbackID,
            QuestionID,
            AnswerOptionID 
        });

        const feedbackDetail_data = await feedbackDetail.save();
        res.status(200).json({
            success: true,
            message: "Feedback detail submitted successfully",
            data: feedbackDetail_data
        });
    }
    catch(error){
        console.error(`Error submitting feedback detail: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = { SubmitFeedbackDetail };