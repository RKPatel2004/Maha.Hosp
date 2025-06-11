const mongoose = require("mongoose");

const FeedbackAnswerTypeSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    AnswerType : {type : String, maxlength : 30},
    ControlType : {type : String, maxlength : 20},
    AppControlType : {type : String, maxlength : 20},
}, { _id: false, collection: "FeedbackAnswerType", strict: false });

const FeedbackAnswerType = mongoose.model("FeedbackAnswerType", FeedbackAnswerTypeSchema);
module.exports = FeedbackAnswerType;
