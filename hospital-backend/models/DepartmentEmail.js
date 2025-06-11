const mongoose = require("mongoose");

const DepartmentEmailSchema = new mongoose.Schema({
   _id : {type : Number, required : true/*, unique : true*/},
   DepartmentID : {type : Number, ref: 'DepartmentMaster'}, 
   EmailID : {type : String, maxlength : 50}
}, { _id: false, collection: "DepartmentEmail", strict: false });

const DepartmentEmail = mongoose.model("DepartmentEmail", DepartmentEmailSchema);
module.exports = DepartmentEmail;