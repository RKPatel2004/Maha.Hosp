const mongoose = require("mongoose");

const HospitalMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    HospitalName : {type : String, maxlength : 250},
    ShortName: {type : String, maxlength : 50},
    HospitalCode : {type : String, maxlength : 50},
    HospitalAddress : {type : String, maxlength : 250},
    Phone1 : {type : String, maxlength : 15},
    Phone2 : {type : String, maxlength : 17},
    OPDAppointmentNumber : {type : String, maxlength : 15},
    Website : {type : String, maxlength : 100},
    EmailID : {type : String, maxlength : 100},
    Latitude : {type : String, maxlength : 20},
    Longitude : {type : String, maxlength : 20}
}, { _id: false, collection: 'HospitalMaster', strict: false });

const HospitalMaster = mongoose.model("HospitalMaster", HospitalMasterSchema);
module.exports = HospitalMaster;