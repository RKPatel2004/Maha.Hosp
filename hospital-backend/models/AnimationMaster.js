const mongoose = require("mongoose");

const AnimationMasterSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true }, // Use AnimationID as _id
    AnimationName: { type: String, maxlength: 50 },
    IsActive: { type: Boolean, default: true }
}, { _id: false }); // Prevent automatic ObjectId _id

const AnimationMaster = mongoose.model("AnimationMaster", AnimationMasterSchema);
module.exports = AnimationMaster;
