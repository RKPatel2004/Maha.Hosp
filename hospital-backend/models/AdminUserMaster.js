const mongoose = require("mongoose");

const AdminUserMasterSchema = new mongoose.Schema({
    _id: { type: Number, required: true/*, unique: true*/ }, 
    UserName: { type: String, maxlength: 50 },
    MobileNo: { type: String, maxlength: 10 },
    Password: { type: String, maxlength: 20 }
}, { _id: false, collection: "AdminUserMaster", strict: false }); 

const AdminUserMaster = mongoose.model("AdminUserMaster", AdminUserMasterSchema);
module.exports = AdminUserMaster;
