const mongoose = require("mongoose");

const TermsConditionSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    TermsConditionMessage : {type : String},
}, { _id: false, collection: 'TermsCondition', strict: false });

const TermsCondition = mongoose.model("TermsCondition", TermsConditionSchema);
module.exports = TermsCondition;