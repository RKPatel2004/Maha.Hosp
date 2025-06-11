const mongoose = require("mongoose");

const FeedbackAnswerOptionSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    AnswerTypeID : {type : Number, ref: 'FeedbackAnswerType'},
    AnswerOption : {type : String, maxlength : 20},
    ImagePath : {type : String, maxlength : 200}
}, { _id: false, collection: "FeedbackAnswerOption", strict: false });

const FeedbackAnswerOption = mongoose.model("FeedbackAnswerOption", FeedbackAnswerOptionSchema);
module.exports = FeedbackAnswerOption;