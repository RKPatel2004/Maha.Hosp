const mongoose = require("mongoose");

const VisitorPolicySchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/}, 
    VisitorPolicyMessage : {type : String},
}, { _id: false, collection: 'VisitorPolicy', strict: false  });

const VisitorPolicy = mongoose.model("VistitorPolicy", VisitorPolicySchema);
module.exports = VisitorPolicy;
