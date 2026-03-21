import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { addBlog, deletedBlog, deleteMultipleData, getAllBlog, getBlogById, removeImageFromCloudinary, updateBlog, uploadImages } from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);

blogRouter.post("/add", auth, addBlog);
blogRouter.get("/", getAllBlog);
blogRouter.get("/:id", getBlogById);
blogRouter.delete("/deteleImage", auth, removeImageFromCloudinary);
blogRouter.delete("/deleteMultiple", auth, deleteMultipleData);
blogRouter.delete("/:id", auth, deletedBlog);
blogRouter.put("/:id", auth, updateBlog);



export default blogRouter;