const mongoose = require("mongoose");

const BulletinMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    StartDate : {type : Date},
    EndDate : {type : Date},
    Title : {type : String, maxlength : 150, default : ""},
    Description : {type : String, maxlength : 500, default : ""},
    IsActive : {type : Boolean, default : true},
    Photo : {type : String, maxlength : 250, default : ""},
}, { _id: false, collection: "BulletinMaster", strict: false });

const BulletinMaster = mongoose.model("BulletinMaster", BulletinMasterSchema);
module.exports = BulletinMaster;
