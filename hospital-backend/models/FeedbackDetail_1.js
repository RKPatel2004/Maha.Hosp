const mongoose = require("mongoose");

const FeedbackDetail_1Schema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    FeedbackID : {type : Number, ref: 'Feedback_1'},
    QuestionID : {type : Number, ref: 'FeedbackQuestion'},
    AnswerOptionID : {type : Number, ref: 'FeedbackAnswerOption'},
}, { _id: false, collection: "FeedbackDetail_1", strict: false });

const FeedbackDetail_1 = mongoose.model("FeedbackDetail_1", FeedbackDetail_1Schema);
module.exports = FeedbackDetail_1;