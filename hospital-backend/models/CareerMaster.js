const mongoose = require("mongoose");

const CareerMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    CareerOpeningID : {type : Number, ref: 'CarrerOpening'},
    DepartmentID : {type : Number} ,
    DesignationID : {type : Number},
    FullName : {type : String, maxLength : 100},
    Gender : {type : String, maxLength : 6},
    CountryCode : {type : Number},
    MobileNo : {type : String, maxLength : 10},
    EmailID : {type : String, maxLength : 50},
    Qualification : {type : String, maxLength : 100},
    TotalExperience : {type : Number},
    FilePath : {type : String, maxLength : 250},
    Remarks : {type : String, maxLength : 250},
    IsRead : {type : Boolean, default : false},
}, { _id: false, collection: "CareerMaster", strict: false });

const CareerMaster = mongoose.model("CareerMaster", CareerMasterSchema);
module.exports = CareerMaster;
