const mongoose = require("mongoose");

const FinancialYearSchema = new mongoose.Schema({
    _id : {type : Number, required : true, unique : true},
    FromDate : {type : Date},
    ToDate : {type : Date},
    YearGroup : {type : String, maxlength : 10},
    IsCurrent : {type : Boolean, default : false}
}, { _id: false });

const FinancialYear = mongoose.model("FinancialYear", FinancialYearSchema);
module.exports = FinancialYear;
