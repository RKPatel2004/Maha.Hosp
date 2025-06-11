const mongoose = require("mongoose");


const TransactionLog_1Schema = new mongoose.Schema({
   _id : {type : Number, required : true, unique : true},
   UserID : {type : Number},
   RecordID : {type : Number},
   APIName : {type : String, maxlength : 150},
   FormPageName : {type : String, maxlength : 30},
   ProcedureName : {type : String, maxlength : 50},
   TransactionDetail : {type : String, maxlength : 500},
   MachineName : {type : String, maxlength : 50},
   InsertTime : {type : Date}
}, { _id: false });

const TransactionLog_1 = mongoose.model("TransactionLog", TransactionLog_1Schema);
module.exports = TransactionLog_1;