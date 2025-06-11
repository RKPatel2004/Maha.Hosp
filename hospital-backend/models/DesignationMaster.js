const mongoose = require("mongoose");

const DesignationMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    Designation : {type : String, maxlength : 50}
}, { _id: false, collection: "DesignationMaster", strict: false });

const DesignationMaster = mongoose.model("DesignationMaster", DesignationMasterSchema);
module.exports = DesignationMaster;