const mongoose = require("mongoose");

const FeedbackQuestionSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    GroupID : {type : Number, ref: 'FeedbackGroup'},
    AnswerTypeID : {type : Number, ref: 'FeedbackAnswerType'},
    Question : {type : String, maxlength : 500},
    ChartType : {type : String, maxlength : 10},
    DisplayNo : {type : Number},
    IsLive : {type : Boolean, default : true},
    IsDisplaytoDoctor : {type : Boolean, default : true}
}, { _id: false, collection: "FeedbackQuestion", strict: false });

const FeedbackQuestion = mongoose.model("FeedbackQuestion", FeedbackQuestionSchema);
module.exports = FeedbackQuestion;