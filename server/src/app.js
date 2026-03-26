const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/test",(req,res)=>{
    res.send("Server Working");
})

module.exports = app