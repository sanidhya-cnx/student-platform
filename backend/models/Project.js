const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
title:String,
description:String,
skillsRequired:[String],
creator:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
teamMembers:[{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}],
status:{
type:String,
default:"open"
}
});

module.exports = mongoose.model("Project", projectSchema)