const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title : String,
    description : String,
    assignTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    status : {
        type : String,
        default : "open"
    }
})