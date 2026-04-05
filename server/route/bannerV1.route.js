import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createBanner,
  deletedBanner,
  getBannerById,
  getBanners,
  removeImageFromCloudinary,
  updateBanner,
  uploadImages,
} from "../controllers/bannerV1.controller.js";
import { deleteMultipleHomeSlider } from "../controllers/homeSlider.controller.js";

const bannerV1Router = Router();
bannerV1Router.post(
  "/uploadImages",
  auth,
  upload.array("images"),
  uploadImages,
);

bannerV1Router.post("/add", auth, createBanner);
bannerV1Router.get("/", getBanners);
bannerV1Router.get("/:id", getBannerById);
bannerV1Router.delete("/deteleImage", auth, removeImageFromCloudinary);
bannerV1Router.delete("/deleteMultiple", auth, deleteMultipleHomeSlider);
bannerV1Router.delete("/:id", auth, deletedBanner);
bannerV1Router.put("/:id", auth, updateBanner);


export default bannerV1Router;
