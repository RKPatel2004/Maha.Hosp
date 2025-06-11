const mongoose = require("mongoose");

const QuestionMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true, unique : true},
    ConceptE : {type : String, required : true},
    ConceptG : {type : String, required : true},
    QuestionE : {type : String, required : true},
    QuestionG : {type : String, required : true},
    QuestionNO : {type : Number, required : true},
    QuestionImage : {type : Buffer},
    ImageUrl : {type : String},
}, { _id: false });

const QuestionMaster = mongoose.model("QuestionMaster", QuestionMasterSchema);
module.exports = QuestionMaster;
