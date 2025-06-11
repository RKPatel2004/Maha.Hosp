const mongoose = require("mongoose");

const CareerOpeningSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    DepartmentID : {type : Number, ref: 'DepartmentMaster'},
    DesignationID : {type : Number, ref: 'DesignationMaster'},
    StartDate : {type : Date},
    EndDate : {type : Date},
    Opening : {type : Number, default : 1},
    IsActive : {type : Boolean, default : true},
}, { _id: false, collection: "CareerOpening", strict: false });

const CareerOpening = mongoose.model("CareerOpening", CareerOpeningSchema);
module.exports = CareerOpening;
