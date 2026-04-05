import { Router } from "express";
import {
  addReviews,
  authWithGoogle,
  forgotPasswordController,
  forgotPasswordReset,
  getAllReviews,
  getAllUsers,
  getReviews,
  loginUserController,
  logoutController,
  refreshToken,
  registerUserController,
  removeImageFromCloudinary,
  resetPassword,
  updateUserDetails,
  userAvatarController,
  userDetails,
  verifyEmailController,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router();
userRouter.post("/register", registerUserController);
userRouter.post("/verifyEmail", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.post("/authWithGoogle", authWithGoogle);
userRouter.get("/logout", auth, logoutController);
userRouter.put(
  "/user-avatar",
  auth,
  upload.array("images"),  // ✅ đổi 'avatar' → 'images'
  userAvatarController
);
userRouter.delete("/deteleImage", auth, removeImageFromCloudinary);
userRouter.put("/:id", auth, updateUserDetails);
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/verify-forgot-password-otp", verifyEmailController);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/user-details", auth, userDetails);
userRouter.post('/forgot-password-reset', forgotPasswordReset);
userRouter.post("/addReview",auth ,addReviews);
userRouter.get("/getReviews",getReviews);
userRouter.get("/getAllReviews", getAllReviews);
userRouter.get("/getAllUsers",getAllUsers);


export default userRouter;
