import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createProduct,
  createProductRam,
  deleteMultipleProduct,
  deleteMultipleProductRams,
  deleteProduct,
  deleteProductRams,
  getAllProducts,
  getAllProductsByCatId,
  getAllProductsByCatName,
  getAllProductsByPrice,
  getAllProductsByRating,
  getAllProductsBySubCatId,
  getAllProductsBySubCatName,
  getAllProductsBySubThirdLaveCatId,
  getAllProductsBySubThirdLaveCatName,
  getAllProductsFeatured,
  getProduct,
  getProductRams,
  getProductRamsById,
  getProductsCount,
  removeImageFromCloudinary,
  updateProductRams,
  updateProducts,
  uploadImages,
} from "../controllers/product.controller.js";

const productRouter = Router();

// ── Images ──────────────────────────────────────────
productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
productRouter.delete("/deteleImage", auth, removeImageFromCloudinary);

// ── Product Rams (cụ thể trước) ──────────────────────
productRouter.get("/productRams/get", getProductRams);
productRouter.post("/productRams/create", auth, createProductRam);
productRouter.get("/productRams/:id", getProductRamsById);
productRouter.put("/productRams/:id", auth, updateProductRams);
productRouter.delete("/productRams/:id", deleteProductRams);
productRouter.delete("/deleteMultipleRams", deleteMultipleProductRams);

// ── Products (cụ thể trước) ──────────────────────────
productRouter.post("/create", auth, createProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getAllProductsByCatId/:id", getAllProductsByCatId);
productRouter.get("/getAllProductsByCatName", getAllProductsByCatName);
productRouter.get("/getAllProductsBySubCatId/:id", getAllProductsBySubCatId);
productRouter.get("/getAllProductsBySubCatName", getAllProductsBySubCatName);
productRouter.get("/getAllProductsByThirdLavelCat/:id", getAllProductsBySubThirdLaveCatId);
productRouter.get("/getAllProductsByThirdLavelCatName", getAllProductsBySubThirdLaveCatName);
productRouter.get("/getAllProductsByPrice", getAllProductsByPrice);
productRouter.get("/getAllProductsByRating", getAllProductsByRating);
productRouter.get("/getAllProductsCount", getProductsCount);
productRouter.get("/getAllFeaturedProducts", getAllProductsFeatured);
productRouter.delete("/deleteMultiple", deleteMultipleProduct);
productRouter.put("/updateProduct/:id", auth, updateProducts);

// ── Route động /:id — PHẢI ĐẶT CUỐI CÙNG ───────────
productRouter.get("/:id", getProduct);
productRouter.delete("/:id", deleteProduct);
export default productRouter;
