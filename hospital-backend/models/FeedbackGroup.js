const mongoose = require("mongoose");

const FeedbackGroupSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    GroupName : {type : String, maxlength : 50}
}, { _id: false, collection: "FeedbackGroup", strict: false });

const FeedbackGroup = mongoose.model("FeedbackGroup", FeedbackGroupSchema);
module.exports = FeedbackGroup;
