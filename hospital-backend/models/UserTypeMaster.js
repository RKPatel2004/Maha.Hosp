const mongoose = require("mongoose");

const UserMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    UserType : {type : String, maxlength : 30},
    IsVisible : {type : Boolean, default : true}
}, { _id: false, collection: "UserTypeMaster", strict: false });

const UserTypeMaster = mongoose.model("UserTypeMaster", UserMasterSchema);
module.exports = UserTypeMaster;