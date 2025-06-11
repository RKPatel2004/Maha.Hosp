const mongoose = require("mongoose");

const Feedback_1Schema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    UserID : {type : Number, ref: 'UserMaster'},
    FeedbackDate : {type : Date},
    Complains : {type : String, maxlength : 500},
    Suggestions : {type : String, maxlength : 500},
    Appreciation : {type : String, maxlength : 500},
    CorrectiveActions : {type : String, maxlength : 500}
}, { _id: false, collection: "Feedback_1", strict: false });    

const Feedback_1 = mongoose.model("Feedback_1", Feedback_1Schema);
module.exports = Feedback_1;