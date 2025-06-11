const mongoose = require("mongoose");

const SMSEmailDetailSchema = new mongoose.Schema({
    _id : {type : Number, required : true/*, unique : true*/},
    Email : {type : String, maxlength : 50},
    EmailPassword : {type : String, maxlength : 30},
    SmtpHost : {type : String, maxlength : 20},
    SmtpPort : {type : Number}
}, { _id: false, collection: "SMSEmailDetail", strict: false });

const SMSEmailDetail = mongoose.model("SMSEmailDetail", SMSEmailDetailSchema);
module.exports = SMSEmailDetail;