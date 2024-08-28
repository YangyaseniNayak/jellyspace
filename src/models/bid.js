const mongoose = require("mongoose");

// We will define a schema(database) as shown below
const BidSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    // projectId: {
    //     type: String
    // },
    projectName: {
        type: String
    },
    projectEmail: {
        type: String
    },
    rupeesId: {
        type:String
    },
    bidAmount: {
        type:Number
    },
    status: {
        type:String,
    },
    bidDescription: {
        type:String
    },
    userEmail: {
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
       }
})

// Let us now create a collection
// first create a model
const Bid = new mongoose.model("Bid", BidSchema);

// Now let us export this model
module.exports = Bid;