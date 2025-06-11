const mongoose = require("mongoose");

const HealthPlanTypeMasterSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    HealthPlanType : {type : String, maxlength : 100},
}, { _id: false, collection: 'HealthPlanTypeMaster', strict: false });

const HealthPlanTypeMaster = mongoose.model("HealthPlanTypeMaster", HealthPlanTypeMasterSchema);
module.exports = HealthPlanTypeMaster;