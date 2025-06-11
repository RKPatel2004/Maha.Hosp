const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    _id : {type : Number, required : true, unique : true},
    UserID : {type : mongoose.Schema.Types.ObjectId, ref: 'UserMaster'},
    FeedbackDate : {type : Date},
    Complains : {type : String, maxlength : 500},
    Suggestions : {type : String, maxlength : 500},
    Appreciation : {type : String, maxlength : 500},
    CorrectiveActions : {type : String, maxlength : 500}
}, { _id: false });    

const Feedback = mongoose.model("Feedback_1", FeedbackSchema);
module.exports = Feedback;




