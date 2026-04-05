import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  createProduct,
  createProductRam,
  createProductWeight,
  createProductSize,
  deleteMultipleProduct,
  deleteMultipleProductRams,
  deleteMultipleProductWeights,
  deleteMultipleProductSizes,
  deleteProduct,
  deleteProductRams,
  deleteProductWeight,
  deleteProductSize,
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
  getProductWeightById,
  getProductWeights,
  getProductSizeById,
  getProductSizes,
  removeImageFromCloudinary,
  updateProductRams,
  updateProducts,
  updateProductWeight,
  updateProductSize,
  uploadImages,
  uploadBannerImages,
  filtes,
  sortBy,
  searchProductController,
} from "../controllers/product.controller.js";

const productRouter = Router();

// ── Images ──────────────────────────────────────────
productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);
productRouter.post(
  "/uploadBannerImages",
  auth,
  upload.array("images"),
  uploadBannerImages,
);
productRouter.delete("/deteleImage", auth, removeImageFromCloudinary);

// ── Product Rams (cụ thể trước) ──────────────────────
productRouter.get("/productRams/get", getProductRams);
productRouter.post("/productRams/create", auth, createProductRam);
productRouter.get("/productRams/:id", getProductRamsById);
productRouter.put("/productRams/:id", auth, updateProductRams);
productRouter.delete("/productRams/:id", deleteProductRams);
productRouter.delete("/deleteMultipleRams", deleteMultipleProductRams);

// ── Product Weight (cụ thể trước) ──────────────────────
productRouter.get("/productWeight/get", getProductWeights);
productRouter.post("/productWeight/create", auth, createProductWeight);
productRouter.get("/productWeight/:id", getProductWeightById);
productRouter.put("/productWeight/:id", auth, updateProductWeight);
productRouter.delete("/productWeight/:id", deleteProductWeight);
productRouter.delete("/deleteMultipleWeight", deleteMultipleProductWeights);

// ── Product Size (cụ thể trước) ──────────────────────
productRouter.get("/productSize/get", getProductSizes);
productRouter.post("/productSize/create", auth, createProductSize);
productRouter.get("/productSize/:id", getProductSizeById);
productRouter.put("/productSize/:id", auth, updateProductSize);
productRouter.delete("/productSize/:id", deleteProductSize);
productRouter.delete("/deleteMultipleSize", deleteMultipleProductSizes);

// ── Products (cụ thể trước) ──────────────────────────
productRouter.post("/create", auth, createProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getAllProductsByCatId/:id", getAllProductsByCatId);
productRouter.get("/getAllProductsByCatName", getAllProductsByCatName);
productRouter.get("/getAllProductsBySubCatId/:id", getAllProductsBySubCatId);
productRouter.get("/getAllProductsBySubCatName", getAllProductsBySubCatName);
productRouter.get(
  "/getAllProductsByThirdLavelCat/:id",
  getAllProductsBySubThirdLaveCatId,
);
productRouter.get(
  "/getAllProductsByThirdLavelCatName",
  getAllProductsBySubThirdLaveCatName,
);
productRouter.get("/getAllProductsByPrice", getAllProductsByPrice);
productRouter.get("/getAllProductsByRating", getAllProductsByRating);
productRouter.get("/getAllProductsCount", getProductsCount);
productRouter.get("/getAllFeaturedProducts", getAllProductsFeatured);
productRouter.delete("/deleteMultiple", deleteMultipleProduct);
productRouter.put("/updateProduct/:id", auth, updateProducts);
productRouter.post("/filters", filtes);
productRouter.post("/sortBy", sortBy);
productRouter.post('/search/get',searchProductController)

// ── Route động /:id — PHẢI ĐẶT CUỐI CÙNG ───────────
productRouter.get("/:id", getProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
