const mongoose = require("mongoose")


const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DataBase Connected")
    }
    catch(error){
        console.log("Error in DATABASE");
        process.exit(1);
    }

}

module.exports = connectDB
