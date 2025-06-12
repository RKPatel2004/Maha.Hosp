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

        // Check if user has already submitted feedback in the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const existingFeedback = await Feedback_1.findOne({
            UserID: UserID,
            FeedbackDate: { $gte: twentyFourHoursAgo }
        });

        if (existingFeedback) {
            return res.status(429).json({
                success: false,
                message: "You can only submit one feedback per day. Please try again after 24 hours."
            });
        }
        
        // Generate auto-incremented _id
        const _id = await generateAutoIncrementedId();

        const feedbackForm = new Feedback_1({
            _id,
            UserID: UserID,
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