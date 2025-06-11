const mongoose = require("mongoose");

const TPAAffiliationSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    CompanyName : {type : String, maxlength : 100},
    Logo : {type : String, maxlength : 250},
}, { _id: false, collection: "TPAAffiliation", strict: false });

const TPAAffiliation = mongoose.model("TPAAffiliation", TPAAffiliationSchema);
module.exports = TPAAffiliation;