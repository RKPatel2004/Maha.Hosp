const mongoose = require("mongoose");

const UserRelationMappingSchema = new mongoose.Schema({
    _id : {type : Number, required : true, unique : true},
    UserID : {type : mongoose.Schema.Types.ObjectId, ref: 'UserMaster'},
    RelationID : {type : Number},
    IsReportRequired : {type : boolean, default : false},
    AssociationName : {type : String, maxlength : 20},
    IsLock : {type : boolean, default : false},
}, { _id: false });

const UserRelationMapping = mongoose.model("UserRelationMapping", UserRelationMappingSchema);
module.exports = UserRelationMapping;