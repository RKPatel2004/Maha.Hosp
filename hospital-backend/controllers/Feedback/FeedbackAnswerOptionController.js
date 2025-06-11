const FeedbackAnswerOption = require('../../models/FeedbackAnswerOption');
const FeedbackAnswerType = require('../../models/FeedbackAnswerType');

const getAllFeedbackAnswerOption = async(req, res) => {
    try {
        const feedbackAnswerOptions = await FeedbackAnswerOption.find({});
        if(feedbackAnswerOptions.length == 0){
            return res.status(404).json({
                success: false,
                message: "No feedback answer options found"
            });
        }

        const response_data = await Promise.all(
            feedbackAnswerOptions.map(async (answerOption) => {
                const feedbackAnswerType = await FeedbackAnswerType.findById(answerOption.AnswerTypeID);
                return {
                    _id: answerOption._id,
                    AnswerTypeID: feedbackAnswerType?._id || null,
                    AnswerType: feedbackAnswerType?.AnswerType || "N/A",
                    ControlType: feedbackAnswerType?.ControlType || "N/A",
                    AppControlType: feedbackAnswerType?.AppControlType || "N/A",
                    AnswerOption: answerOption?.AnswerOption || "N/A",
                    ImagePath: answerOption?.ImagePath || ""
                };
            })
        );

        res.json({
            success: true,
            count: response_data.length,
            data: response_data
        });

    } catch(error) {
        console.error(`Error fetching feedback answer options: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = { getAllFeedbackAnswerOption };