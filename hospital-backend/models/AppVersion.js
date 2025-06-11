const mongoose = require("mongoose");

const AppVersionSchema = new mongoose.Schema({
    _id : {type : Number, required : true, unique : true},
    AppVersion : {type : String, maxlength : 20},
    IsForceUpdate : {type : Boolean, default : false},
    InsertTime : {type : Date},
}, { _id: false }); // Prevents Mongoose from automatically adding a new ObjectId _id

const AppVersion = mongoose.model("AppVersion", AppVersionSchema);
module.exports = AppVersion;
