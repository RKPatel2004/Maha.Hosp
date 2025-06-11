const Feedback_1 = require("../../models/Feedback_1");

// Helper function to generate an auto-incremented _id
async function generateAutoIncrementedId() {
    // Find the document with the highest _id
    const lastFeedback = await Feedback_1.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

    // If collection is empty, start from 1, else increment the max _id by 1
    return lastFeedback ? lastFeedback._id + 1 : 1;
}

const SubmitFeedbackForm = async (req, res) => {
    try {
        const {
            Complains,
            Suggestions,
            Appreciation,
            CorrectiveActions
        } = req.body;

        // Generate auto-incremented _id
        const _id = await generateAutoIncrementedId();

        const feedbackForm = new Feedback_1({
            _id,
            UserID: 17, // Ideally, get this from authenticated user
            FeedbackDate: Date.now(),
            Complains,
            Suggestions,
            Appreciation,
            CorrectiveActions
        });

        // Save the feedback form and wait for completion
        await feedbackForm.save();

        res.status(200).json({
            success: true,
            message: "Feedback form submitted successfully",
            _id
        });
    }
    catch (error) {
        console.error("Error submitting feedback form:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            error: "Error submitting feedback form"
        });
    }
};

module.exports = { SubmitFeedbackForm };
