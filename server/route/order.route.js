import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createOrderController,
  getOrdersByUserController,
  createOrderPaypalController,
  captureOrderPaypalController,
  updateOrderStatusController,
  getTotalOrdersCountController,
  totalUserController,
  totalSalesController,
} from "../controllers/order.controller.js";

const orderRouter = Router();

// Stripe order routes
orderRouter.post("/create", auth, createOrderController);
orderRouter.get("/order-list", auth, getOrdersByUserController);
orderRouter.get('/count' , auth , getTotalOrdersCountController);
orderRouter.get("/users", auth, totalUserController);
orderRouter.get("/sales", auth, totalSalesController);

// PayPal order routes
orderRouter.get("/create-order-paypal", auth, createOrderPaypalController);
orderRouter.post("/capture-order-paypal", auth, captureOrderPaypalController);
orderRouter.put("/order-status/:id", auth, updateOrderStatusController);

export default orderRouter;
