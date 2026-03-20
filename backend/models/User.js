const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },

    email : {
        type: String,
        required: true,
        unique: true
    },

    password : {
        type: String,
        required: true
    },

    skills : [String],

    projects : [String],  // id of project from all projects 

    bio : {
        type: String,
        default: ""
    },

    experiencePoints : {
        type : Number,
        default : 0
    } 
},
{
    timestamps: true
});

module.exports = mongoose.model("User",userSchema);