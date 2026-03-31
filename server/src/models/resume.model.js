const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
        maxLength:50000
    },
    score:{
        type:Number,
        min:0,
        max:100
    },
    strengths:{
        type:[String],
        default:[]
    },
    weaknesses:{
        type:[String],
        default:[]
    },
    suggestions:{
        type:[String],
        default:[]
    }
},{
    timestamps:true
})

const Resume = mongoose.model("Resume",resumeSchema)

module.exports = Resume