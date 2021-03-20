const jwt = require("jsonwebtoken");
const User=require("../models/userModel");

const protect=async(req,res,next)=>{
	let token;
	if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
		try{
			token=req.headers.authorization.split(" ")[1];
			const decode= jwt.verify(token,process.env.JWT_SECRET);
			req.user= await User.findById(decode.id).select("-password");
		}catch(error){
			console.log(error);
		}		
	}
	if(!token){
		res.status(401);
		throw new Error("Not authorized,no token");
	}
	next();
}

const admin = (req,res,next)=>{
	if(req.user && req.user.isAdmin){
		next();
	}else{
		res.status(401);
		throw new Error("Not authorized as an admin");
	}
}

module.exports={
	protect,
	admin
}