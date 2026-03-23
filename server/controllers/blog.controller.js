import BlogModel from "../models/blog.model.js";

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

// Create blog
export async function addBlog(request, response) {
  try {
    const { title, description, images } = request.body;

    if (!title || !images || !Array.isArray(images) || images.length === 0) {
      return response.status(400).json({
        message: "Title and images are required",
        error: true,
        success: false,
      });
    }

    const blog = new BlogModel({
      title,
      description: description || "",
      images,
    });

    await blog.save();

    return response.status(201).json({
      message: "Blog created successfully",
      blog: blog,
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

// Get all blogs
export async function getAllBlog(request, response) {
  try {
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10;
    const totalPosts = await BlogModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages && totalPages !== 0) {
      return response.status(404).json({
        message: "Page not found",
        success: false,
        error: true,
      });
    }

    const blogs = await BlogModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!blogs || blogs.length === 0) {
      return response.status(200).json({
        message: "No blogs found",
        data: [],
        error: false,
        success: true,
      });
    }

    response.status(200).json({
      success: true,
      error: false,
      data: blogs,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get blog by ID
export async function getBlogById(request, response) {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid blog ID",
        error: true,
        success: false,
      });
    }

    const blog = await BlogModel.findById(id);

    if (!blog) {
      return response.status(404).json({
        message: "Blog not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      blog: blog,
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

// Delete blog
export async function deletedBlog(request, response) {
  try {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid blog ID",
        error: true,
        success: false,
      });
    }

    const blog = await BlogModel.findByIdAndDelete(id);

    if (!blog) {
      return response.status(404).json({
        message: "Blog not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Blog deleted successfully",
      blog: blog,
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

// Update blog
export async function updateBlog(request, response) {
  try {
    const { id } = request.params;
    const { title, description, images } = request.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({
        message: "Invalid blog ID",
        error: true,
        success: false,
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (images && Array.isArray(images)) updateData.images = images;

    const blog = await BlogModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return response.status(404).json({
        message: "Blog not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Blog updated successfully",
      blog: blog,
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

// Delete multiple blogs
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
        message: "One or more invalid blog IDs",
        error: true,
        success: false,
      });
    }

    const result = await BlogModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return response.status(404).json({
        message: "No blogs found to delete",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} blog(s) deleted successfully`,
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
