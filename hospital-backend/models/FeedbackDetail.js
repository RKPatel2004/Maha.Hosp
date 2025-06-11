const mongoose = require("mongoose");

const FeedbackDetailSchema = new mongoose.Schema({
    _id : {type : Number, required : true, unique : true},
    FeedbackID : {type : mongoose.Schema.Types.ObjectId, ref: 'Feedback_1'},
    QuestionID : {type : mongoose.Schema.Types.ObjectId, ref: 'FeedbackQuestion'},
    AnswerOptionID : {type : mongoose.Schema.Types.ObjectId, ref: 'FeedbackAnswerOption'},
}, { _id: false });

const FeedbackDetail = mongoose.model("FeedbackDetail", FeedbackDetailSchema);
module.exports = FeedbackDetail;