import { request } from "express";
import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    productTitle: {
      type: String,
      request: true,
    },
    image: {
      type: String,
      request: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      request: true,
    },
    oldPrice: {
      type: Number,
      request: true,
    },
    discount: {
      type: Number,
      request: true,
    },
    size: {
      type: String,
      request: true,
    },
    weight: {
      type: String,
      request: true,
    },
    ram: {
      type: String,
      request: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    subTotal: {
      type: Number,
      default: true,
    },
    productId: {
      type: String,
      request: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      request: "User",
    },
    brand: {
      type: String,
      request: "User",
    },
  },
  {
    timeseries: true,
  },
);

const CartProductModel = mongoose.model("cart", cartProductSchema);

export default CartProductModel;
