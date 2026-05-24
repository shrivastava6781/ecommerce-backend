const multer = require("multer")

// MiddleWare 
const storage = multer.diskStorage({
    destination: (req, file, CB)=>{
        CB(null, "uploads/")
    },
    filename: (req, file, CB)=>{
        CB(null, file.originalname)
    }
})

const uploads = multer({storage})
module.exports = uploads