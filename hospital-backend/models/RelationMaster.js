const mongoose = require("mongoose");

const RelationMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true, unique : true},
    Relation : {type : String, maxlength : 100},
}, { _id: false });

const RelationMaster = mongoose.model("RelationMaster", RelationMasterSchema);
module.exports = RelationMaster;