import express, { Router } from "express";
import {
  uploadImages,
  createHomeSlider,
  getHomeSliders,
  getHomeById,
  updateHomeSlider,
  deleteHomeSlider,
  removeImageFromCloudinary,
  deleteMultipleHomeSlider,
} from "../controllers/homeSlider.controller.js";
import multer from "multer";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const homeSliderRouter = Router();

// Upload images endpoint
homeSliderRouter.post("/uploadImages", upload.array("images"), uploadImages);

// Create home slider
homeSliderRouter.post("/add", auth, createHomeSlider);

// Get all home sliders
homeSliderRouter.get("/", getHomeSliders);

// Delete image from Cloudinary
// ✅ Fix: đặt route cụ thể TRƯỚC route có params /:id
homeSliderRouter.delete("/deteleImage", auth, removeImageFromCloudinary);

// ✅ Fix: đổi route deleteMultiple thành /deleteMultiple thay vì trùng /:id
homeSliderRouter.delete("/deleteMultiple", auth, deleteMultipleHomeSlider);

// Get home slider by ID
homeSliderRouter.get("/:id", getHomeById);

// Update home slider
homeSliderRouter.put("/:id", auth, updateHomeSlider);

// Delete home slider by ID
homeSliderRouter.delete("/:id", auth, deleteHomeSlider);

export default homeSliderRouter;
