import homeSliderModel from "../models/homeSlider.model.js";

import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
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

    for (const file of images) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      // LƯU ảnh vào biến toàn cục
      imagesArr.push(uploaded.secure_url);

      fs.unlinkSync(file.path);
    }

    return response.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Create Home Slider
export async function createHomeSlider(request, response) {
  try {
    let slide = new homeSliderModel({
      images: imagesArr,
    });

    if (!slide) {
      return response.status(500).json({
        success: false,
        message: "slide not create",
        error: true,
      });
    }

    slide = await slide.save();

    imagesArr = [];

    return response.status(201).json({
      success: true,
      message: "Home slider created successfully",
      data: slide, // ✅ was "savedHomeSlider" (not defined)
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

// Get Home Sliders
export async function getHomeSliders(request, response) {
  try {
    const slides = await homeSliderModel.find();

    if (!slides) {
      return response.status(404).json({
        message: "Slider not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      success: true,
      data: slides,
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

//detele imgaes
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

// Delete Home Slider
export async function deleteHomeSlider(request, response) {
  try {
    const slide = await homeSliderModel.findById(request.params.id);
    const images = slide.images;
    let img = "";

    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          //console.log(error, result)
        });
      }
    }

    const deletedSlide = await homeSliderModel.findByIdAndDelete(
      request.params.id,
    );

    if (!deletedSlide) {
      return response.status(404).json({
        success: false,
        message: "slide not found!",
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      message: "Home slider deleted successfully",
      data: deletedSlide,
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

// Get Home Slider By ID
export async function getHomeById(request, response) {
  try {
    const slide = await homeSliderModel.findById(request.params.id);

    if (!slide) {
      return response.status(400).json({
        success: false,
        message: "Invalid home slider ID",
        error: true,
      });
    }

    return response.status(200).json({
      success: true,
      data: slide,
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

// Update Home Slider
export async function updateHomeSlider(request, response) {
  try {
    const slide = await homeSliderModel.findByIdAndUpdate(
      request.params.id,
      {
        images: imagesArr.length > 0 ? imagesArr[0] : request.body.image,
      },
      {
        new: true,
      },
    );

    if (!slide) {
      return response.status(404).json({
        success: false,
        message: " slider cannot be update!",
        error: true,
      });
    }

    const updatedSlide = await slide.save();

    return response.status(200).json({
      success: true,
      message: "Home slider updated successfully",
      data: updatedSlide,
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

//delete multiple products
export async function deleteMultipleHomeSlider(request, response) {
  const { ids } = request.body;
  console.log("request.body:", request.body); // ← thêm dòng này

  // ✅ Early return — nằm độc lập, không bọc logic bên trong
  if (!ids || !Array.isArray(ids)) {
    return response.status(400).json({
      error: true,
      success: false,
      message: "Invalid input",
    });
  }

  try {
    // ✅ Xóa ảnh trên Cloudinary trước
    for (let i = 0; i < ids.length; i++) {
      const product = await homeSliderModel.findById(ids[i]);
      if (!product) continue; // ✅ bỏ qua nếu không tìm thấy

      const images = product.images;

      for (const imgUrl of images) {
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0]; // ✅ khai báo đúng scope

        if (imageName) {
          cloudinary.uploader.destroy(imageName, (error, result) => {});
        }
      }
    }

    // ✅ ids thay vì is (typo cũ)
    await homeSliderModel.deleteMany({ _id: { $in: ids } });

    return response.status(200).json({
      success: true,
      error: false,
      message: "Slides Deleted",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
