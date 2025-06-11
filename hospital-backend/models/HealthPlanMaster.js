const mongoose = require("mongoose");

const HealthPlanMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    HospitalID : {type : /*mongoose.Schema.Types.ObjectId*/Number, ref: 'HospitalMaster'},
    HealthPlanTypeID : {type : /*mongoose.mongoose.Types.ObjectId*/Number, ref: 'HealthPlanTypeMaster'},
    HealthPlanName : {type : String, maxlength : 250},
    Description : {type : String, maxlength : 500},
    price : {type : mongoose.Schema.Types.Decimal128, default : 0},
    CoverImagePath : {type : String, maxlength : 250},
    FilePath : {type : String, maxlength : 250},
    IsActive : {type : Boolean, default : true}
}, { _id: false, collection: 'HealthPlanMaster', strict: false });

const HealthPlanMaster = mongoose.model("HealthPlanMaster", HealthPlanMasterSchema);
module.exports = HealthPlanMaster;