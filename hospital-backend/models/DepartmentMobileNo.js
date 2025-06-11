const mongoose = require("mongoose");

const DepartmentMobileNoSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    DepartmentID : {type : Number, ref: 'DepartmentMaster'},
    MobileNo : {type : Number, maxlength : 10},
    PhoneNo : {type : Number, maxlength : 15}
}, { _id: false, collection: "DepartmentMobileNo", strict: false });

const DepartmentMobileNo = mongoose.model("DepartmentMobileNo", DepartmentMobileNoSchema);
module.exports = DepartmentMobileNo;