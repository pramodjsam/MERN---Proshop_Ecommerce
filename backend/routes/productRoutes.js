const express=require("express");
// const Product=require("../models/productModel");
// const asyncHandler=require("express-async-handler");
const {getProducts,
	getProductById,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductReview,
	getTopProducts}= require("../controllers/productController");
const {protect,admin} = require("../middleware/authMiddleware");
const router=express.Router();

router.route("/").get(getProducts).post(protect,admin,createProduct);

router.get("/top",getTopProducts)

router.route("/:id")
	.get(getProductById)
	.delete(protect,admin,deleteProduct)
	.put(protect,admin,updateProduct);

router.route("/:id/reviews").post(protect,createProductReview);



module.exports=router;