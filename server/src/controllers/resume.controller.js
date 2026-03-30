const Resume = require("../models/resume.model")

async function uploadResume(req,res) {

    const content = req.body.content;

    if(!content){
        return res.status(400).json({
            message:"Content is required"
        })
    }

    const resume = await Resume.create({
        content:content
    });


    res.status(200).json({
        message:"Resume saved",
        resume
    })
    
}

module.exports = uploadResume