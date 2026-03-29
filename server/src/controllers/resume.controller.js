async function uploadResume(req,res) {

    const content = req.body.content;

    if(!content){
        return res.status(400).json({
            message:"Content is required"
        })
    }
    res.status(200).json({
        message:"Resume is uploaded"
    })
    
}

module.exports = uploadResume