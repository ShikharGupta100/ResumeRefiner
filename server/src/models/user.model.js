const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required."],
        trim:true,
        maxlength:[50, "Name too long"],
    },
    email:{
        type:String,
        required:[true, "Email is required."],
        unique:true,
        lowercase:true,
        trim:true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format."],
    },
    password:{
        type:String,
        minlength:[6,"Password must be at least 6 characters."]
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    verificationToken: {type:String},
    verificationTokenExpiry :{type : Date},
},{
    timestamps:true
});

userSchema.pre("save",async function (next) {
    if(!this.isModified("password") || !this.password) return
    this.password = await bcrypt.hash(this.password,12);
});


userSchema.methods.comparePassword = async function (candidate){
    return bcrypt.compare(candidate,this.password)
}

module.exports = mongoose.model("User",userSchema)