const mongoose = require("mongoose");

// We will define a schema(database) as shown below
const ProjectSchema = new mongoose.Schema({
    projectName: {
        type:String,
        required:true
    },
    projectDescription: {
        type:String,
        required:true
    },
    skills: {
        type:Array,
    },
    billingProcess: {
        type:String,
    },
    budget: {
        type:String,
    },
    projectType: {
        type:String,
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
const Project = new mongoose.model("Project", ProjectSchema);

// Now let us export this model
module.exports = Project;