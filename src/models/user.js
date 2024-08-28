const mongoose = require("mongoose");

// We will define a schema(database) as shown below
const CommpanySchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
    },
    accountType: {
        type:String,
    },
    entityName: {
        type:String,
    },
    dateOfInCorporation: {
        type:String,
    },
    title: {
        type:String,
    },
    mobileNo: {
        type:String,
    },
    skills: {
        type: Array,
    },
    image:{
        type:String,
    },
    street:{
        type:String,
    },
    h_number:{
        type:String,
    },
    city:{
        type:String,
    },
    postalCode:{
        type:String,
    },
    country:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
       }
})

// Let us now create a collection
// first create a model
const Register = new mongoose.model("Register", CommpanySchema);

// Now let us export this model
module.exports = Register;