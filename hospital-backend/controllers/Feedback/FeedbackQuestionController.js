const FeedbackQuestion = require("../../models/FeedbackQuestion");
const FeedbackGroup = require("../../models/FeedbackGroup");
const FeedbackAnswerType = require("../../models/FeedbackAnswerType");

const getAllFeedbackQuestion = async (req, res) => {
    try {
        const feedbackQuestions = await FeedbackQuestion.find().sort({ DisplayNo: 1 });
        
        if(feedbackQuestions.length == 0)
        {
            res.json({
                success: false,
                message: "No feedback questions found",
            });
        }

        const response_data = await Promise.all(
            feedbackQuestions.map(async (question) => {
                const feedbackGroup = await FeedbackGroup.findById(question.GroupID);
                const feedbackAnswerType = await FeedbackAnswerType.findById(question.AnswerTypeID);
                return {
                    _id: question._id,
                    GroupID: feedbackGroup?._id || null,
                    GroupName: feedbackGroup?.GroupName || "N/A",
                    AnswerTypeID: feedbackAnswerType?._id || null,
                    AnswerType: feedbackAnswerType?.AnswerType || "N/A",
                    ControlType: feedbackAnswerType?.ControlType || "N/A",
                    AppControlType: feedbackAnswerType?.AppControlType || "N/A",
                    Qusetion: question?.Question || "N/A",
                    ChartType: question?.ChartType || "N/A",
                    DisplayNo: question?.DisplayNo || "N/A",
                    IsLive: question?.IsLive,
                    IsDisplaytoDoctor: question?.IsDisplaytoDoctor
                };
            })
        );

        res.json({
            success: true,
            count: response_data.length,
            data: response_data
            });
            
        } catch (error) {
        console.error("Error fetching feedback questions:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = { getAllFeedbackQuestion };