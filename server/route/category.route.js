import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getCategoryCount,
  getSubCategoryCount,
  removeImageFromCloudinary,
  updateCategory,
  uploadImages,
} from "../controllers/category.controller.js";

const categoryRouter = Router();
categoryRouter.post(
  "/uploadImages",
  auth,
  upload.array("images"),
  uploadImages
);
categoryRouter.post("/create", auth, upload.array("images"), createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/get/count", getCategoryCount);
categoryRouter.get("/get/count/subCat", getSubCategoryCount);
categoryRouter.get("/:id", getCategory);
categoryRouter.delete("/deteleImage", auth, removeImageFromCloudinary);
categoryRouter.delete("/:id", auth, deleteCategory);
categoryRouter.put("/:id", auth, updateCategory);

export default categoryRouter;
