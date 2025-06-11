const mongoose = require("mongoose");

const UserMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    UserTypeID : {type : Number, ref: 'UserTypeMaster', default : 2},
    UserName : {type : String, maxlength : 150},
    Address : {type : String, maxlength : 150},
    Pincode : {type : String, maxlength : 10},
    CountryCode : {type : Number},
    MobileNo : {type : String, maxlength : 10},
    EmailID : {type : String, maxlength : 100},
    UserPassword : {type : String, maxlength : 200},
    UniqueDeviceID : {type : String, maxlength : 250},
    TokenID : {type : String, maxlength : 250},
    IsWebsite : {type : Boolean, default : false},
    FilePath : {type : String, maxlength : 250},
    RegistrationDate : {type : Date, default : Date.now}
}, { _id: false, collection: "UserMaster", strict: false });

const UserMaster = mongoose.model("UserMaster", UserMasterSchema);
module.exports = UserMaster;