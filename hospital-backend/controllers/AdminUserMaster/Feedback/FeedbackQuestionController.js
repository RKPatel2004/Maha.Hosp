const FeedbackQuestion = require("../../../models/FeedbackQuestion");
const FeedbackGroup = require("../../../models/FeedbackGroup");
const FeedbackAnswerType = require("../../../models/FeedbackAnswerType");
const FeedbackDetail_1 = require("../../../models/FeedbackDetail_1");
const FeedbackAnswerOption = require("../../../models/FeedbackAnswerOption");

async function generateAutoIncrementedId() {
    const lastFeedbackQuestion = await FeedbackQuestion.findOne({}, { _id: 1 })
        .sort({ _id: -1 })
        .lean();
    return lastFeedbackQuestion ? lastFeedbackQuestion._id + 1 : 1;
}
async function generateAutoIncrementedDisplayNo() {
    const lastFeedbackQuestion = await FeedbackQuestion.findOne({}, { DisplayNo: 1 })
        .sort({ DisplayNo: -1 })
        .lean();
    return lastFeedbackQuestion ? lastFeedbackQuestion.DisplayNo + 1 : 1;
}

const SubmitFeedbackQuestion = async (req, res) => {

    const userId = req.user.userId || req.user.adminId;

    const {
        GroupName,
        AnswerType,
        ChartType,
        Question,
        IsLive,
        IsDisplaytoDoctor
    } = req.body || {};

    if (!userId) {
        res.status(400).json({
            sucess: fale,
            message: "User ID not found in token"
        });
    }

    if (!GroupName || !AnswerType || !Question) {
        return res.status(400).json({
            success: false,
            message: "GroupName, AnswerType, and Question are required fields"
        });
    }

    const feedbackGroup = await FeedbackGroup.findOne({ GroupName: GroupName });

    if (!feedbackGroup) {
        return res.status(404).json({
            success: false,
            message: "Feedback group not found"
        });
    }
    const feedbackGroupId = feedbackGroup._id;

    const feedbackAnswerType = await FeedbackAnswerType.findOne({ AnswerType: AnswerType });
    if (!feedbackAnswerType) {
        return res.status(404).json({
            success: false,
            message: "Feedback answer type not found"
        });
    }
    const feedbackAnswerTypeId = feedbackAnswerType._id;

    const _id = await generateAutoIncrementedId();
    const displayNo = await generateAutoIncrementedDisplayNo();

    const newFeedbackQuestion = new FeedbackQuestion({
        _id: _id,
        GroupID: feedbackGroupId,
        AnswerTypeID: feedbackAnswerTypeId,
        ChartType: ChartType,
        Question: Question,
        DisplayNo: displayNo,
        IsLive: IsLive || false,
        IsDisplaytoDoctor: IsDisplaytoDoctor || false
    });
    await newFeedbackQuestion.save();

    res.status(201).json({
        sucess: true,
        message: "👍Feedback question submitted successfully",
        data: newFeedbackQuestion
    });
};

const DeleteFeedbackQuestion = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;

        if (!userId) {
            res.status(400).json({
                sucess: fale,
                message: "User ID not found in token"
            });
        }

        const feedbackQuestion = await FeedbackQuestion.findOne({ _id: req.params.id });

        if (!feedbackQuestion) {
            return res.status(404).json({
                success: false,
                message: "Feedback question not found"
            });
        }

        await feedbackQuestion.deleteOne();

        res.status(200).json({
            success: true,
            message: "🗑️Feedback question deleted successfully"
        });
    } catch (ereror) {
        console.error(`Error deleting feedback question: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getAllFeedbackQuestion = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;

        if (!userId) {
            res.status(404).json({
                sucess: fale,
                message: "User ID not found in token"
            });
        }

        const feedbackQuestions = await FeedbackQuestion.find({});

        if(feedbackQuestions.length == 0)
        {
            res.status(404).json({
                success: false,
                message: "No feedback questions found"
            });
        }

        let enrichedFeedbackQuestions = [];
        for(let feedbackQuestion of feedbackQuestions)
        {
            const enrichedfeedbackQuestion = {
                _id: feedbackQuestion._id,
                Question: feedbackQuestion.Question,
                ChartType: feedbackQuestion.ChartType,
                DisplayNo: feedbackQuestion.DisplayNo,
                IsLive: feedbackQuestion.IsLive,
                IsDisplaytoDoctor: feedbackQuestion.IsDisplaytoDoctor
            };

            if(feedbackQuestion.GroupID)
            {
                const groupName = await FeedbackGroup.find({_id: feedbackQuestion.GroupID});

                if(groupName)
                {
                    enrichedfeedbackQuestion.GroupName = groupName.GroupName;
                }
            }

            if(feedbackQuestion.FeedbackAnswerTypeID)
            {
                const answerType = await FeedbackAnswerType.find({_id: feedbackQuestion.FeedbackAnswerTypeID});

                if(answerType)
                {
                    enrichedfeedbackQuestion.AnswerType = answerType.AnswerType;
                }
            }
            enrichedFeedbackQuestions.push(enrichedfeedbackQuestion);
        }
        
        res.status(200).json({
            success: true,
            message: "Feedback questions fetched successfully",
            count: enrichedFeedbackQuestions.length,
            data: enrichedFeedbackQuestions
        });
    } catch (error) {
        console.error(`Error deleting feedback question: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const SearchFeedbackQuestion = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        const {GroupName, Question} = req.body || {};

        if (!userId) {
            res.status(404).json({
                sucess: false,
                message: "User ID not found in token"
            });
        }

        const feedbackQuestions = await FeedbackQuestion.find({});

        if(feedbackQuestions.length == 0)
        {
            res.status(404).json({
                success: false,
                message: "No feedback questions found"
            });
        }

        let enrichedFeedbackQuestions = [];
        for(let feedbackQuestion of feedbackQuestions)
        {
            const enrichedfeedbackQuestion = {
                _id: feedbackQuestion._id,
                Question: feedbackQuestion.Question,
                ChartType: feedbackQuestion.ChartType,
                DisplayNo: feedbackQuestion.DisplayNo,
                IsLive: feedbackQuestion.IsLive,
                IsDisplaytoDoctor: feedbackQuestion.IsDisplaytoDoctor
            };

            if(feedbackQuestion.GroupID)
            {
                const groupName = await FeedbackGroup.findById(feedbackQuestion.GroupID);

                if(groupName)
                {
                    enrichedfeedbackQuestion.GroupName = groupName.GroupName;
                }
            }

            if(feedbackQuestion.AnswerTypeID)
            {
                const answerType = await FeedbackAnswerType.findById(feedbackQuestion.AnswerTypeID);
                if(answerType)
                {
                    enrichedfeedbackQuestion.AnswerType = answerType.AnswerType;
                }
            }

            let isInclude = true;
            if(GroupName || Question)
            {
                isInclude = true;
                if(GroupName && Question)
                {
                    isInclude = enrichedfeedbackQuestion.GroupName == GroupName && enrichedfeedbackQuestion.Question == Question;
                }
                else if(GroupName && !Question)
                {
                    isInclude = enrichedfeedbackQuestion.GroupName == GroupName;
                }
                else if(!GroupName && Question)
                {
                    isInclude = enrichedfeedbackQuestion.Question == Question;
                }
            }

            if(isInclude)
            {
                enrichedFeedbackQuestions.push(enrichedfeedbackQuestion);
            }
        }
        
        res.status(200).json({
            success: true,
            message: "Feedback questions fetched successfully",
            count: enrichedFeedbackQuestions.length,
            data: enrichedFeedbackQuestions
        });
    } catch (error) {
        console.error(`Error deleting feedback question: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

const editFeedbackQuestion = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        const { id } = req.params;
        
        const {
            Question,
            ChartType,
            DisplayNo,
            IsLive,
            IsDisplaytoDoctor,
            GroupName,
            AnswerType
        } = req.body || {};

        // Check if user ID exists
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        // Check if feedback question ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Feedback question ID is required"
            });
        }

        // Find the existing feedback question
        const existingFeedbackQuestion = await FeedbackQuestion.findOne({ _id: id });
        
        if (!existingFeedbackQuestion) {
            return res.status(404).json({
                success: false,
                message: "Feedback question not found"
            });
        }

        // Prepare update object
        const updateData = {};

        // Update Question if provided
        if (Question !== undefined) {
            updateData.Question = Question;
        }

        // Update ChartType if provided
        if (ChartType !== undefined) {
            updateData.ChartType = ChartType;
        }

        // Update DisplayNo if provided
        if (DisplayNo !== undefined) {
            updateData.DisplayNo = DisplayNo;
        }

        // Update IsLive if provided
        if (IsLive !== undefined) {
            updateData.IsLive = IsLive;
        }

        // Update IsDisplaytoDoctor if provided
        if (IsDisplaytoDoctor !== undefined) {
            updateData.IsDisplaytoDoctor = IsDisplaytoDoctor;
        }

        // Handle GroupName update
        if (GroupName !== undefined) {
            const feedbackGroup = await FeedbackGroup.findOne({ GroupName: GroupName });
            
            if (!feedbackGroup) {
                return res.status(404).json({
                    success: false,
                    message: "Feedback group not found"
                });
            }
            updateData.GroupID = feedbackGroup._id;
        }

        // Handle AnswerType update
        if (AnswerType !== undefined) {
            const feedbackAnswerType = await FeedbackAnswerType.findOne({ AnswerType: AnswerType });
            
            if (!feedbackAnswerType) {
                return res.status(404).json({
                    success: false,
                    message: "Feedback answer type not found"
                });
            }
            updateData.AnswerTypeID = feedbackAnswerType._id;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        // Update the feedback question
        const updatedFeedbackQuestion = await FeedbackQuestion.findOneAndUpdate(
            { _id: id },
            updateData,
            { new: true, runValidators: true }
        );

        // Prepare enriched response data
        const enrichedResponse = {
            _id: updatedFeedbackQuestion._id,
            Question: updatedFeedbackQuestion.Question,
            ChartType: updatedFeedbackQuestion.ChartType,
            DisplayNo: updatedFeedbackQuestion.DisplayNo,
            IsLive: updatedFeedbackQuestion.IsLive,
            IsDisplaytoDoctor: updatedFeedbackQuestion.IsDisplaytoDoctor
        };

        // Add GroupName to response
        if (updatedFeedbackQuestion.GroupID) {
            const groupData = await FeedbackGroup.findById(updatedFeedbackQuestion.GroupID);
            if (groupData) {
                enrichedResponse.GroupName = groupData.GroupName;
            }
        }

        // Add AnswerType to response
        if (updatedFeedbackQuestion.AnswerTypeID) {
            const answerTypeData = await FeedbackAnswerType.findById(updatedFeedbackQuestion.AnswerTypeID);
            if (answerTypeData) {
                enrichedResponse.AnswerType = answerTypeData.AnswerType;
            }
        }

        res.status(200).json({
            success: true,
            message: "✏️ Feedback question updated successfully",
            data: enrichedResponse
        });

    } catch (error) {
        console.error(`Error updating feedback question: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const SearchFeedbackReport = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.adminId;
        const { AnswerType, GroupName, ForDoctor } = req.body || {};

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found in token"
            });
        }

        if (!AnswerType || !GroupName) {
            return res.status(400).json({
                success: false,
                message: "AnswerType and GroupName are required fields"
            });
        }

        const feedbackAnswerType = await FeedbackAnswerType.findOne({ AnswerType: AnswerType });
        
        if (!feedbackAnswerType) {
            return res.status(404).json({
                success: false,
                message: "Feedback answer type not found"
            });
        }
        const answerTypeId = feedbackAnswerType._id;

        const feedbackGroup = await FeedbackGroup.findOne({ GroupName: GroupName });
        
        if (!feedbackGroup) {
            return res.status(404).json({
                success: false,
                message: "Feedback group not found"
            });
        }
        const groupId = feedbackGroup._id;

        let questionFilter = { 
            AnswerTypeID: answerTypeId, 
            GroupID: groupId 
        };
        
        if (ForDoctor !== undefined) {
            questionFilter.IsDisplaytoDoctor = ForDoctor;
        }

        const feedbackQuestions = await FeedbackQuestion.find(questionFilter);

        if (feedbackQuestions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No feedback questions found"
            });
        }

        const allAnswerOptions = await FeedbackAnswerOption.find({ AnswerTypeID: answerTypeId });

        const answerOptionMap = {};
        allAnswerOptions.forEach(option => {
            answerOptionMap[option._id] = {
                id: option._id,
                name: option.AnswerOption,
                imagePath: option.ImagePath
            };
        });

        let enrichedFeedbackReport = [];

        for (let i = 0; i < feedbackQuestions.length; i++) {
            const feedbackQuestion = feedbackQuestions[i];
            const questionId = feedbackQuestion._id;
            
            const feedbackDetails = await FeedbackDetail_1.find({ QuestionID: questionId });

            const answerCounts = {};
            allAnswerOptions.forEach(option => {
                answerCounts[option.AnswerOption] = 0;
            });

            let totalResponses = 0;
            for (let detail of feedbackDetails) {
                const answerOptionId = detail.AnswerOptionID;
                if (answerOptionMap[answerOptionId]) {
                    const optionName = answerOptionMap[answerOptionId].name;
                    answerCounts[optionName]++;
                    totalResponses++;
                }
            }

            const questionReport = {
                srNo: i + 1,
                group: feedbackGroup.GroupName,
                question: feedbackQuestion.Question,
                ...answerCounts, 
                total: totalResponses
            };

            enrichedFeedbackReport.push(questionReport);
        }

        if (enrichedFeedbackReport.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No feedback report found"
            });
        }

        // Also return the answer option headers for UI reference
        const answerOptionHeaders = allAnswerOptions.map(option => ({
            id: option._id,
            name: option.AnswerOption,
            imagePath: option.ImagePath
        }));

        return res.status(200).json({
            success: true,
            message: "Feedback report generated successfully",
            count: enrichedFeedbackReport.length,
            answerType: AnswerType,
            groupName: GroupName,
            forDoctor: ForDoctor,
            answerOptionHeaders: answerOptionHeaders,
            data: enrichedFeedbackReport
        });

    } catch (error) {
        console.error("Error searching feedback report:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = { SubmitFeedbackQuestion, 
    DeleteFeedbackQuestion, 
    getAllFeedbackQuestion,
    SearchFeedbackQuestion,
    editFeedbackQuestion,
    SearchFeedbackReport 
};