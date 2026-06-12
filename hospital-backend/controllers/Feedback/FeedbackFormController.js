const Feedback_1 = require("../../models/Feedback_1");

async function generateAutoIncrementedId() {
    const lastFeedback = await Feedback_1.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();

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