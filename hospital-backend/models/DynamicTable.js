const mongoose = require("mongoose");

const DynamicTableSchema = new mongoose.Schema({
    _id : {type : Number, required : true, unique : true},
    TableName : {type : String, maxlength : 30},
    TableDetail : {type : String},
}, { _id: false });

const DynamicTable = mongoose.model("DynamicTable", DynamicTableSchema);
module.exports = DynamicTable;