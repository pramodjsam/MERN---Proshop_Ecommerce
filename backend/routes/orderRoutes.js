const express=require("express");
const {addOrderItems,
	getOrderById,
	updatedOrderToPaid,
	updatedOrderToDelivered,
	getMyOrders,getOrders}=require("../controllers/orderController");
const {protect,admin}=require("../middleware/authMiddleware");
const Router=express.Router();

Router.route("/").post(protect,addOrderItems).get(protect,admin,getOrders);

Router.route("/myorders").get(protect,getMyOrders);

Router.route("/:id").get(protect,getOrderById);

Router.route("/:id/pay").put(protect,updatedOrderToPaid);

Router.route("/:id/deliver").put(protect,admin,updatedOrderToDelivered)



module.exports=Router;