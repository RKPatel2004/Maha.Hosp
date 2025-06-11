const mongoose = require("mongoose");

const DepartmentMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    HospitalID : {type : /*mongoose.Schema.Types.ObjectId*/Number, ref: 'HospitalMaster'},
    DepartmentName : {type : String, maxlength : 50},
    IsDisplay : {type : Boolean, default : true},
    InsertBy : {type : Number},
    InsertTime : {type : Date},
    UpdateBy : {type : Number},
    UpdateTime : {type : Date}
}, { _id: false, collection: "DepartmentMaster", strict: false });

const DepartmentMaster = mongoose.model("DepartmentMaster", DepartmentMasterSchema);
module.exports = DepartmentMaster;
