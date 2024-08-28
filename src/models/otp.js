const mongoose = require("mongoose");

// We will define a schema(database) as shown below
const otpSchema = new mongoose.Schema({
    status: {
        type:Number
    },
    mail: {
        type:String
    },
    OTP: {
        type:Number
    },
    success: {
        type:Boolean
    },
})

// , {
//     capped: { size: 1024 },
//     bufferCommands: false,
//     autoCreate: false // disable `autoCreate` since `bufferCommands` is false
//   }

// Let us now create a collection
// first create a model
const OTP = mongoose.model("OTP", otpSchema);

// Now let us export this model
module.exports = OTP;