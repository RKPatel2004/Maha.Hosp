const mongoose = require("mongoose");

const WebFormMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    FormName : {type : String, maxlength : 100},
    FormDisplayName : {type : String, maxlength : 100},
    MenuID : {type : String, maxlength : 50},
    FormType : {type : String, maxlength : 50},
    IsClose : {type : Boolean},
    CloseNotes : {type : String},
}, { _id: false, collection: "WebFormMaster", strict: false });

const WebFormMaster = mongoose.model("WebFormMaster", WebFormMasterSchema);
module.exports = WebFormMaster;
