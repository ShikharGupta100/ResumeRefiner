const express=require("express");
const router = express.Router();
const uploadResume=require("../controllers/resume.controller")


router.post("/upload",uploadResume);

module.exports=router
