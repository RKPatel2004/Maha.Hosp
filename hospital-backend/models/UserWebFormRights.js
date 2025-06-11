const mongoose = require("mongoose");

const UserWebFormRightsSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    FormID : {type : Number},
    UserTypeID : {type : Number},
    UserID : {type : Number}  
}, { _id: false, collection: "UserWebFormRights", strict: false });

const UserWebFormRights = mongoose.model("UserWebFormRights", UserWebFormRightsSchema);
module.exports = UserWebFormRights;