import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../config/emailService.js";
import sendEmailFun from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToke from "../utils/generatedRefreshToken.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ReviewsModel from "../models/reviews.model.js";
import ProductModel from "../models/product.model.js";
import { error } from "console";

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret, // Click 'View API Keys' above to copy your API secret
  secure: true,
});

export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide name, email, password",
        error: true,
        success: false,
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        message: "User already registered with this email",
        error: true,
        success: false,
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const user = new UserModel({
      name,
      email,
      password: hashPassword,
      otp: verifyCode,
      otpExpires: Date.now() + 600000,
      isVerified: false,
      status: "Active",
    });

    await user.save();

    console.log("OTP:", verifyCode); // DEBUG

    try {
      await sendEmailFun({
        sendTo: email,
        subject: "Verify email from Ecommerce App",
        html: verifyEmailTemplate(name, verifyCode),
      });
    } catch (err) {
      console.log("Email send error:", err);
    }

    return response.status(200).json({
      success: true,
      error: false,
      message: "User registered successfully! Please verify your email.",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { email, otp } = request.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpExpires < Date.now()) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "OTP expired",
      });
    }

    user.verify_email = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function authWithGoogle(request, response) {
  const { name, email, avatar, mobile, role } = request.body;

  try {
    const existingUser = await UserModel.findOne({ email });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    if (!existingUser) {
      // ✅ Dùng result thay vì user
      const result = await UserModel.create({
        name,
        mobile,
        email,
        password: "null",
        avatar,
        role: role || "USER",
        verify_email: true,
        signUpWithGoogle: true,
      });
      // ✅ Không cần await user.save() - create() đã tự save

      const accesstoken = await generatedAccessToken(result._id); // ✅ result._id
      const refreshToken = await generatedRefreshToke(result._id); // ✅ result._id

      response.cookie("accessToken", accesstoken, cookiesOption);
      response.cookie("refreshToken", refreshToken, cookiesOption);

      return response.status(200).json({
        message: "Login successfully",
        error: false,
        success: true,
        data: { accesstoken, refreshToken },
      });
    } else {
      const accesstoken = await generatedAccessToken(existingUser._id);
      const refreshToken = await generatedRefreshToke(existingUser._id);

      response.cookie("accessToken", accesstoken, cookiesOption);
      response.cookie("refreshToken", refreshToken, cookiesOption);

      return response.status(200).json({
        message: "Login successfully",
        error: false,
        success: true,
        data: { accesstoken, refreshToken },
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function loginUserController(request, response) {
  try {
    const { email, password } = request.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "User not registered",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact admin",
        error: true,
        success: false,
      });
    }

    if (user.verify_email !== true) {
      return response.status(400).json({
        message: "Please verify your email first",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return response.status(400).json({
        message: "Incorrect password",
        error: true,
        success: false,
      });
    }

    const accesstoken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToke(user._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", accesstoken, cookiesOption);
    response.cookie("refreshToken", refreshToken, cookiesOption);

    return response.status(200).json({
      message: "Login successfully",
      error: false,
      success: true,
      data: { accesstoken, refreshToken },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutController(request, response) {
  try {
    const userid = request.userId; // middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.clearCookie("accessToken", cookiesOption);
    response.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return response.json({
      message: "Logout successfylly",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//image upload
var imagesArr = [];
// image upload
export async function userAvatarController(request, response) {
  try {
    const userId = request.userId;
    const images = request.files;

    if (!images || images.length === 0) {
      return response.status(400).json({
        message: "No images uploaded",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    // ✅ Xóa ảnh cũ - lấy đúng publicId kể cả folder
    if (user.avatar) {
      try {
        const urlArr = user.avatar.split("/upload/");
        if (urlArr.length > 1) {
          const withoutVersion = urlArr[1].replace(/^v\d+\//, ""); // bỏ v123/
          const publicId = withoutVersion.split(".")[0]; // bỏ .jpg
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.log("Delete old avatar error:", err);
      }
    }

    // ✅ Upload ảnh mới
    const imagesArr = [];
    for (const file of images) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });
      imagesArr.push(uploaded.secure_url);
      fs.unlinkSync(file.path);
    }

    // ✅ Lưu avatar mới
    user.avatar = imagesArr[0];
    await user.save();

    return response.status(200).json({
      _id: userId,
      avatar: imagesArr[0],
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function removeImageFromCloudinary(request, response) {
  const imgUrl = request.query.img;
  const urlArr = imgUrl.split("/");

  const image = urlArr[urlArr.length - 1];
  const imageName = image.split(".")[0];

  if (imageName) {
    const res = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {
        // console.log(error , res)
      },
    );
    if (res) {
      response.status(200).send(res);
    }
  }
}

//update user details
export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId;
    const { name, email, mobile, password } = request.body;

    const userExist = await UserModel.findById(userId);
    if (!userExist)
      return response.status(400).send("The user cannot be Updated");

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        name: name,
        mobile: mobile,
        email: email,
      },
      { new: true },
    );
    if (email !== userExist.email) {
      //send verification email
      await sendEmailFun({
        sendTo: email,
        subject: "Verify email from Ecommerce App",
        text: "",
        html: verifyEmailTemplate(name, verifyCode),
      });
    }

    return response.json({
      message: "User details updated successfully",
      error: false,
      success: true,
      user: {
        name: updatedUser?.name,
        _id: updatedUser?._id,
        email: updatedUser?.email,
        mobile: updatedUser?.mobile,
        avatar: updatedUser?.avatar,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//forgot password
export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Email not available",
      });
    } else {
      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = verifyCode;
      user.otpExpires = Date.now() + 600000;

      await user.save();

      await sendEmailFun({
        sendTo: email,
        subject: "Verify email from Ecommerce App",
        text: "",
        html: verifyEmailTemplate(user.name, verifyCode),
      });

      return response.json({
        message: "check your email",
        error: false,
        success: true,
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Email not found",
      });
    }

    if (!email || !otp) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Provide required field email, otp.",
      });
    }

    if (otp !== user.otp) {
      return response.status(400).json({
        error: true,
        success: false,
        message: "Invalid OTP",
      });
    }

    const currentTime = new Date().toISOString();

    if (user.otpExpires < currentTime) {
      return response.status(400).json({
        error: false,
        success: true,
        message: "OTP is expired!",
      });
    }

    user.otp = "";
    user.otpExpires = "";

    await user.save();

    return response.status(400).json({
      error: false,
      success: true,
      message: "Verified OTP successfully",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//rest password
export async function resetPassword(request, response) {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = request.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return response
        .status(400)
        .json({ message: "Email not available", error: true, success: false });
    }

    // ✅ Chỉ check oldPassword khi KHÔNG đăng nhập Google
    if (user?.signUpWithGoogle === false) {
      if (!oldPassword) {
        return response.status(400).json({
          message: "Please provide old password",
          error: true,
          success: false,
        });
      }
      const checkPassword = await bcryptjs.compare(oldPassword, user.password); // ✅ sửa checkPasswrod → checkPassword
      if (!checkPassword) {
        return response.status(400).json({
          message: "Your old password is wrong",
          error: true,
          success: false,
        });
      }
    }

    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);
    user.password = hashPassword;
    user.signUpWithGoogle = false;
    await user.save();

    return response.json({
      message: "Password updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Dùng cho forgot-password flow (không cần oldPassword)
export async function forgotPasswordReset(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body;

    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "provide email, newPassword, confirmPassword",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "newPassword and confirmPassword must be same",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();

    return response.json({
      message: "Password updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//refresh token controller
export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies.refreshToken ||
      request.headers.authorization.split(" ")[1];

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN,
    );

    if (!verifyToken) {
      return response.status(401).json({
        message: "token is expired",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken._id;
    const newAccessToken = await generatedAccessToken(userId);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    response.cookie("accessToken", newAccessToken, cookiesOption);

    return response.json({
      message: "New access token generated ",
      error: false,
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get login user details
export async function userDetails(request, response) {
  try {
    const userId = request.userId;

    console.log("userId", userId);

    const user = await UserModel.findById(userId)
      .select("-password -refresh_token")
      .populate("address_details");

    return response.json({
      message: "User details fetched successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//review contrller
export async function addReviews(request, response) {
  try {
    const { image, userName, review, rating, userId, productId } = request.body;

    if (!review || !rating || !userId || !productId) {
      return response.status(400).json({
        message: "Please provide all required fields",
        error: true,
        success: false,
      });
    }

    const userReview = new ReviewsModel({
      image,
      userName,
      review, // ✅ sửa rieview → review
      rating,
      userId,
      productId,
    });

    await userReview.save();

    // ✅ Cập nhật rating trung bình cho Product
    const allReviews = await ReviewsModel.find({ productId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await ProductModel.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
    });

    return response.json({
      message: "Review added successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get  reviews
export async function getReviews(request, response) {
  try {
    const productId = request.query.productId;

    const reviews = await ReviewsModel.find({ productId: productId });

    return response.status(200).json({
      error: false,
      success: true,
      reviews: reviews,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get All reviews
export async function getAllReviews(request, response) {
  try {
    const reviews = await ReviewsModel.find();

    if (!reviews) {
      return response.status(400).json({
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      reviews: reviews,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get user
export async function getAllUsers(request, response) {
  try {
    const users = await UserModel.find();

    if (!users) {
      return response.status(400).json({
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      error: false,
      success: true,
      users: users,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
