const mongoose = require("mongoose");

const HospitalHistorySchema = new mongoose.Schema({
   _id : {type : Number, required : true/*, unique : true*/},
   HospitalID : {type : Number},
   History : {type : String}, 
}, { _id: false, collection: "HospitalHistory", strict: false });

const HospitalHistory = mongoose.model("HospitalHistory", HospitalHistorySchema);
module.exports = HospitalHistory;