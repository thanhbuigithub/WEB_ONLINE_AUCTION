const multer= require("multer");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/images/upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()  + path.extname(file.originalname))
    }
  })

const upload= multer({storage: storage}).single("fileUser");

module.exports= upload;