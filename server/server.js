const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app")
const connectDB = require("./src/config/db")

async function connection() {
    const port = process.env.PORT
    await connectDB();
    app.listen(port,()=>{
        console.log("Server Start");
    });
    
}
connection();






