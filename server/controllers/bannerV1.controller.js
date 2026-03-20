import bannerV1Model from "../models/bannerV1.model.js";

import { v2 as cloudinary } from "cloudinary";
import e from "express";
import fs from "fs";
import mongoose from "mongoose";

// Configuration
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret, // Click 'View API Keys' above to copy your API secret
  secure: true,
});

//image upload
var imagesArr = [];
// image upload
export async function uploadImages(request, response) {
  try {
    const images = request.files;
    const uploadedUrls = [];

    for (const file of images) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      uploadedUrls.push(uploaded.secure_url);
      fs.unlinkSync(file.path);
    }

    return response.status(200).json({
      images: uploadedUrls, // ✅ trả về array URLs
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

// Create banner
export async function createBanner(request, response) {
  try {
    const {
      bannerTitle,
      catId,
      subCatId,
      thirdsubCatId,
      price,
      images,
      alignInfo,
    } = request.body;

    if (!bannerTitle) {
      return response.status(400).json({
        message: "Banner title is required",
        error: true,
        success: false,
      });
    }

    if (!price) {
      return response.status(400).json({
        message: "Price is required",
        error: true,
        success: false,
      });
    }

    if (!images || images.length === 0) {
      return response.status(400).json({
        message: "At least one image is required",
        error: true,
        success: false,
      });
    }

    const banner = new bannerV1Model({
      bannerTitle,
      images, // ✅ lấy từ body thay vì imagesArr global
      catId,
      subCatId,
      thirdsubCatId,
      price,
      alignInfo,
    });

    const savedBanner = await banner.save();

    return response.status(201).json({
      banner: savedBanner,
      message: "Banner created successfully",
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

// Get all banners
export async function getBanners(request, response) {
  try {
    const banners = await bannerV1Model.find();

    if (!banners) {
      return response.status(500).json({
        error: false,
        success: true,
      });
    }

    return response.status(200).json({
      data: banners,
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

// Delete banner
export async function deletedBanner(request, response) {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid banner ID",
        error: true,
        success: false,
      });
    }

    const banner = await bannerV1Model.findById(id);

    if (!banner) {
      return response.status(404).json({
        message: "Banner not found",
        error: true,
        success: false,
      });
    }

    // ✅ Xóa từng ảnh trên Cloudinary
    if (banner.images && banner.images.length > 0) {
      for (const imgUrl of banner.images) {
        const urlArr = imgUrl.split("/");
        const fileName = urlArr[urlArr.length - 1];
        const publicId = fileName.split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await bannerV1Model.findByIdAndDelete(id);

    return response.status(200).json({
      message: "Banner deleted successfully",
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

// Get banner by ID
export async function getBannerById(request, response) {
  try {
    const banner = await bannerV1Model.findById(request.params.id);

    if (!banner) {
      return response.status(404).json({
        message: "Banner not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      banner: banner,
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

// Update banner
export async function updateBanner(request, response) {
  try {
    const { id } = request.params; // ✅ lấy id trước

    // ✅ Validate ID trước khi query
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid banner ID",
        error: true,
        success: false,
      });
    }

    const updatedBanner = await bannerV1Model.findByIdAndUpdate(
      // ✅ đặt tên đúng
      id,
      {
        bannerTitle: request.body.bannerTitle,
        images: imagesArr.length > 0 ? imagesArr : request.body.images, // ✅ cả array, không phải [0]
        catId: request.body.catId,
        subCatId: request.body.subCatId,
        thirdsubCatId: request.body.thirdsubCatId,
        price: request.body.price,
        alignInfo : request.body.alignInfo,
      },
      { new: true },
    );

    if (!updatedBanner) {
      return response.status(404).json({
        message: "Banner not found",
        error: true,
        success: false,
      });
    }

    imagesArr = [];

    return response.status(200).json({
      banner: updatedBanner, // ✅ đúng tên biến
      message: "Banner updated successfully",
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
      response.status(200).json({
        error: false,
        success: true,
        message: "image deleted successfully",
      });
    }
  }
}

// Delete multiple banners
export async function deleteMultipleData(request, response) {
  try {
    const { ids } = request.body;

    // Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return response.status(400).json({
        message: "Invalid or empty IDs array",
        error: true,
        success: false,
      });
    }

    // Validate all IDs
    const validIds = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!validIds) {
      return response.status(400).json({
        message: "One or more invalid banner IDs",
        error: true,
        success: false,
      });
    }

    const result = await bannerV1Model.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return response.status(404).json({
        message: "No banners found to delete",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} banner(s) deleted successfully`,
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


