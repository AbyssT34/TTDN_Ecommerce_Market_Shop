import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createOrderController,
  getOrdersByUserController,
  createOrderPaypalController,
  captureOrderPaypalController,
} from "../controllers/order.controller.js";

const orderRouter = Router();

// Stripe order routes
orderRouter.post("/create", auth, createOrderController);
orderRouter.get("/order-list", auth, getOrdersByUserController);

// PayPal order routes
orderRouter.get("/create-order-paypal", auth, createOrderPaypalController);
orderRouter.post("/capture-order-paypal", auth, captureOrderPaypalController);

export default orderRouter;
