const path=require("path");
const express = require("express");
const multer= require("multer");
const router = express.Router();

const storage = multer.diskStorage({
	destination(req,file,cb){
		cb(null,"uploads/")
	},
	filename(req,file,cb){
		cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
	}
})

function checkFileType(file,cb){
	const filetype=/jpg|jpeg|png/;
	const extname = filetype.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetype.test(file.mimetype);
	if(extname && mimetype){
		return cb(null,true);
	}else{
		return cb("Images only!!")
	}
}

const upload= multer({
	storage,
	fileFilter:function(req,file,cb){
		checkFileType(file,cb)
	}
})

router.post("/",upload.single('image'),(req,res)=>{
	const path = req.file.path.replace(/\\/g,"/")
	res.send(`/${path}`)
})


module.exports = router;