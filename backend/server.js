const express=require("express");
const path = require("path");
const dotenv=require("dotenv");
const morgan=require("morgan");
const connectDB=require("./config/db");
const colors=require("colors");
const products=require("./data/products");
const productRoutes=require("./routes/productRoutes");
const orderRoutes=require("./routes/orderRoutes");
const userRoutes=require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const {notFound,errorHandler} =require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app=express();

if(process.env.NODE_ENV === "development"){
	app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/products",productRoutes);

app.use("/api/users",userRoutes);

app.use("/api/orders",orderRoutes);

app.use("/api/uploads",uploadRoutes);

app.get("/api/config/paypal",(req,res)=>{
	res.send(process.env.PAYPAL_CLIENT_ID)
})

app.use("/uploads",express.static(path.join(__dirname,"../uploads")));

if(process.env.NODE_ENV === 'production'){
	app.use(express.static(path.join(__dirname,"../frontend/build")));

	app.use("*",(req,res)=>{
		res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
	})
}else{
	app.get("/",(req,res)=>{
	res.send("Backend working");
})
}




app.use(notFound)

app.use(errorHandler)

const port= process.env.PORT || 4000;

app.listen(port,function(){
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow.bold);
})