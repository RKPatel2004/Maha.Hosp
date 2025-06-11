const mongoose = require("mongoose");

const MissonVisionSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    Misson : {type : String},
    Vision : {type : String},
}, { _id: false, collection: "MissonVision", strict: false });

const MissonVision = mongoose.model("MissonVision", MissonVisionSchema);
module.exports = MissonVision;