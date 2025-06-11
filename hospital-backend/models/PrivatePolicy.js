const mongoose = require("mongoose");

const PrivatePolicySchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    PrivatePolicyMessage : {type : String},
}, { _id: false, collection: 'PrivatePolicy', strict: false});

const PrivatePolicy = mongoose.model("PrivatePolicy", PrivatePolicySchema);

module.exports = PrivatePolicy;