const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resume.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/resume",resumeRoutes)

app.get("/test",(req,res)=>{
    res.send("Server Working");
})

module.exports = app