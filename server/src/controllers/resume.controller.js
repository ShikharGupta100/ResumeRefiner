const Resume = require("../models/resume.model");
const analyzeResume = require("../services/ai.service");

async function uploadResume(req,res) {

    const content = req.body.content;

    if(!content){
        return res.status(400).json({
            message:"Content is required"
        })
    }

    try{
        const analysisResult = await analyzeResume(content);

        const resume = await Resume.create({
            content,
            score:analysisResult.score,
            strengths:analysisResult.strengths,
            weaknesses:analysisResult.weaknesses,
            suggestions:analysisResult.suggestions
        });

        res.status(200).json({
            message:"Resume analyzed and saved successfully",
            resume,
        })



    }
    catch(error){
        res.status(500).json({
            message:"Something went wrong",
            error:error.message
        })
    }
    
}

async function getAllResumes(req,res) {
    try{
        const resumes = await Resume.find()
    
            res.status(200).json({
                message:"ResumeList found",
                resumes
            })    

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}


 
    


module.exports = getAllResumes,uploadResume